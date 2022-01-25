class NameCard extends ComponentABS{
    constructor(user_data = null)
    {
        super();
        this.user_data = user_data;

    }
    static get observedAttributes() {return ['editable']; }

    handleClick(e) {
        e.composedPath().find((node) => 
        {
            if (!node.className || !node.className.match(/command/)) return false;
            if (node.className.match(/command-modify-card/))
            {
                const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
                node.closest('section').style.color = randomColor;
            }
            if (node.className.match(/command-delete-card/))
            {
                this.post_message("done_delete_name_card", this.user_data);
                this.remove();
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
                this.setAttribute('editable', 'editable');
            }
            //로그아웃 되었다면 
            if(event.data.msg === `status_logout`) 
            {
                this.setAttribute('editable', 'nonEditable');
            }
        }
    }

    connectedCallback() {
        this._render(this.user_data);
    }
        
    disconnectedCallback(){
        console.log("disconnectedCallback");
        window.removeEventListener("message", this.receiveMessage);
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom square element attributes changed.');
        console.log(`${name}, ${oldValue}, ${newValue},`);
        if(name === 'editable' && this.shadowRoot)
        {
            this.editable = newValue;
            this._setSettingVisible(newValue);
        }
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
        if(!user_data) //for Test
        {
            const temp_user_data = JSON.parse(this.getAttribute('user_data'));
            user_data = {...temp_user_data};
        }
        this.editable = this.getAttribute('editable');

        const shadowRoot = this.attachShadow({mode: 'open'});
        const template = document.querySelector('#name_card');
        const user_image = document.createElement('img');
        user_image.setAttribute('slot', 'user_image');
        user_image.src = user_data?.profile_img;
        user_image.style = 'width:60px; height:60px; border-radius: 50%;';
        this.appendChild(user_image); //${user_image.outerHTML} 이렇게 엘리먼트를 만들어도 되고
        this.innerHTML += ` 
        <span slot="name">${user_data?.name}</span>
        <span slot="email">${user_data?.email}</span>
        <span slot="phone">${user_data?.phone}</span>
        <span slot="role">${user_data?.role}</span>
        <p slot="company_name">${user_data?.company_name}</p>
        <div slot="setting" class="settings"></div>
        `;//이렇게 직접 텍스트로 삽입도 가능
        shadowRoot.appendChild(template.content.cloneNode(true));
        this._setSettingVisible(this.editable);
        console.log(this.editable);
    }

    _setSettingVisible(visible)
    {
        const settings_ele  = this.shadowRoot.querySelector('.settings');
        if(visible === 'editable') settings_ele.style.display = 'flex';
        else settings_ele.style.display = 'none';
    }

}
customElements.define('name-card', NameCard);