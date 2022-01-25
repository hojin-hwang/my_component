class NavBar extends ComponentABS{
    constructor(user_data = null)
    {
        super();
        this.user_data = user_data;
    }
    static get observedAttributes() {return ['attribute_name']; }

    handleClick(e) {
        e.composedPath().find((node) => 
        {
            if (!node.className || !node.className.match(/command/)) return false;
            if (node.className.match(/command-open-login-form/))
            {
                this.post_message("open_login_form", null);
            }
            if (node.className.match(/command-logout/))
            {
                this.post_message("do_logout", null);
            }
        });
    }
    onMessage(event){
        const window_url = `https://${window.location.hostname}`;
        //if(event.origin !== window_url) return;
        if(event.data?.msg) 
        {
            //로그인 되었다면 
            if(event.data.msg === `status_login`) 
            {
                this.shadowRoot.querySelector('.login-btn').classList.add('command-logout');
                this.shadowRoot.querySelector('.login-btn').classList.remove('command-open-login-form');
                this.shadowRoot.querySelector('.login-btn').innerHTML = 'Log Out';
                console.log("component recevie log in status..");
            }
            //로그아웃 되었다면 
            if(event.data.msg === `status_logout`) 
            {
                this.shadowRoot.querySelector('.login-btn').classList.remove('command-logout');
                this.shadowRoot.querySelector('.login-btn').classList.add('command-open-login-form');
                this.shadowRoot.querySelector('.login-btn').innerHTML = 'Login';
                console.log("component recevie log out status..");

            }

  
        }
    }

    connectedCallback() {
        if(!this.showComponent) return;
        this._render(this.user_data);
    }
        
    disconnectedCallback(){
        console.log("disconnectedCallback");
        window.removeEventListener("message", this.receiveMessage);
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom square element attributes changed.');
        console.log(`${name}, ${oldValue}, ${newValue},`);
    }

    getComponentProp(data_set_value)
    {
        const component_prop = {};
        
        switch(data_set_value.exam_type)
        {
            default : console.log(data_set_value);
        }
        return component_prop;
    }

    _render(user_data = null)
    {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const template = document.querySelector('#nav_bar');
        shadowRoot.appendChild(template.content.cloneNode(true));
    

    }

}
customElements.define('nav-bar', NavBar);