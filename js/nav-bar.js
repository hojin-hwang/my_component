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
                post_message("open_login_form", null);
            }
            if (node.className.match(/command-logout/))
            {
                //post_message("done_delete_name_card", null);
                //this.remove();
            }
        });
    }
    onMessage(event){
        const window_url = `https://${window.location.hostname}`;
        if(event.origin !== window_url) return;
        if(event.data?.msg) 
        {
            //로그인 되었다면 color버튼을 활성화 한다.
            if(event.data.msg === `message_status_user_login`) 
            {
                this.shadowRoot.querySelector('div.settings').style.display = 'flex';
                console.log("component recevie login status..")
            }
            if(event.data.msg === `message_status_user_logout`) 
            {
                this.shadowRoot.querySelector('div.settings').style.display = 'none';
            }
            if(event.data.msg === `${this.message_prefix}_show_user_name_card`) 
            {
                this._render(event.data.data);
                
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