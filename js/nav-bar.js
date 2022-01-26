class NavBar extends ComponentABS{
    constructor(user_data = null)
    {
        super();
        this.user_data = user_data;

    }
    static get observedAttributes() {return ['is_login']; }

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
            if (node.className.match(/command-show-empty-card/))
            {
                this.post_message("show_empty_name_card", null);
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
                this.setAttribute('is_login', true);
            }
            //로그아웃 되었다면 
            if(event.data.msg === `status_logout`) 
            {
                this.setAttribute('is_login', false);
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
        console.log('nav-bar element attributes changed.');
        console.log(`${name}, ${oldValue}, ${newValue},`);
        this.is_login = (newValue === 'true');
        this._render(this.user_data);
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
        const template = document.querySelector('#nav_bar');
        if(this.shadowRoot) 
        {
            this.shadowRoot.textContent = '';
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
        else
        {
            const shadowRoot = this.attachShadow({mode: 'open'});
            shadowRoot.appendChild(template.content.cloneNode(true));
        }
        console.log(this.is_login);
        if(this.is_login) this._set_logout_btn();
        else this._set_login_btn()
        

    }

    _set_login_btn()
    {
        this.shadowRoot.querySelector('.login-btn').classList.remove('command-logout');
        this.shadowRoot.querySelector('.login-btn').classList.add('command-open-login-form');
        this.shadowRoot.querySelector('.login-btn').innerHTML = 'Login';

        this.shadowRoot.querySelector('.title-btn').classList.remove('command-show-empty-card');
        this.shadowRoot.querySelector('.title-btn').innerHTML = 'Name Card';
        
    }

    _set_logout_btn()
    {
        this.shadowRoot.querySelector('.login-btn').classList.add('command-logout');
        this.shadowRoot.querySelector('.login-btn').classList.remove('command-open-login-form');
        this.shadowRoot.querySelector('.login-btn').innerHTML = 'Log Out';

        this.shadowRoot.querySelector('.title-btn').classList.add('command-show-empty-card');
        this.shadowRoot.querySelector('.title-btn').innerHTML = 'Add New Card';
        
    }

}
customElements.define('nav-bar', NavBar);