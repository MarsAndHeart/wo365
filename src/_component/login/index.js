import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import Input from '../base/input';
import VerificationCode from '../base/verificationCode';
import P from '../../_modules/public';
import sty from './style';


let pwd=W.getSetting("pwd");
let account=W.getSetting("account");
let remember_pwd=W.getSetting('remember_pwd');
class Login extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            verification:'none'
        }
        this.formData={
            'password':pwd,
            'account':account
        };
        
        this.loginSuccess = this.loginSuccess.bind(this);
        this.submit = this.submit.bind(this);
        this.change = this.change.bind(this);
        this.remember = this.remember.bind(this);
    }
    componentDidMount() {
        if(this.formData.password&&this.formData.account)
            this.submit();
    }
    
    loginSuccess(res){
        if(res.status_code){//登录出错
            W.errorCode(res);
            return;
        }
        
        let that=this;
        Wapi.user.get(function(result) {
            Object.assign(result.data,res);
            that.props.onSuccess(result);
        }, {
            objectId: res.uid,
            access_token: res.access_token
        });
    }
    submit(){
        this.formData.account=this.formData.account?this.formData.account.trim():null;
        this.formData.password=this.formData.password?this.formData.password.trim():null;
    
        if(!this.formData.account){
            this.setState({account_err:___.input_account});
            return;
        }
        if(!this.formData.password){
            this.setState({password_err:___.input_pwd});
            return;
        }
        Wapi.user.login(this.loginSuccess,Object.assign({},this.formData),{err:true});
        if(this.need_remember){
            W.setSetting("pwd",this.formData.password);
            W.setSetting("account",this.formData.account);
        }
    }
    change(e,val){
        let name=e.currentTarget.name;
        this.formData[name]=val;
        if(val){
            let s={};
            s[name+'_err']='';
            this.setState(s);
        }
    }
    remember(e,val){//点击记住密码
        this.need_remember=val;
        W.setSetting('remember_pwd',val);
    }

    render() {
        return (
            <div {...this.props}>
                <Input
                    name='account'
                    hintText={___.input_account}
                    floatingLabelText={___.account}
                    defaultValue={this.formData.account}
                    errorText={this.state.account_err}
                    onChange={this.change}
                />
                <Input
                    name='password'
                    type='password'
                    hintText={___.input_pwd}
                    floatingLabelText={___.pwd}
                    defaultValue={this.formData.password}
                    errorText={this.state.password_err}
                    onChange={this.change}
                />
                <Checkbox
                    label={___.remember}
                    defaultChecked={remember_pwd}
                    onCheck={this.remember}
                    style={sty.ch}
                    labelStyle={sty.cl}
                />
                <RaisedButton label={___.login} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}

export default Login;