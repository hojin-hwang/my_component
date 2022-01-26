class NameCard extends ComponentABS{
    constructor(user_data = null)
    {
        super();
        this.user_data = user_data;
        this.editable = (this.getAttribute('editable') === 'editable');
        this.editting = this.getAttribute('editting');
    }
    static get observedAttributes() {return ['editable','editting']; }

    handleClick(e) {
        e.composedPath().find((node) => 
        {
            if (!node.className || !node.className.match(/command/)) return false;
            if (node.className.match(/command-modify-card/))
            {
                const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
                node.closest('section').style.color = randomColor;
                this.setAttribute('editting', true);
                return;
            }
            if (node.className.match(/command-do-modify/))
            {
                this.setAttribute('editting', false);
                return;
            }
            if (node.className.match(/command-delete-card/))
            {
                console.log(this.user_data)
                WebSql.deleteCard(this.user_data.rowid).then(() => {
                    this.post_message('done_delete_name_card', null);
                    this.remove();
                }); 
                
                return;
            }
        });
    }
    onMessage(event){
        const window_url = `https://${window.location.hostname}`;
        //if(event.origin !== window_url) return;
        if(event.data?.msg) 
        {
            if(event.data.msg === `${this.message_prefix}_show_user_name_card`) 
            {
                this._render(event.data.data);
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
        console.log('Name Card element attributes changed.');
        console.log(`${name}, ${oldValue}, ${newValue},`);
        if(name === 'editable')
        {
            this.editable = (newValue === 'editable');
            this._setSettingVisible(this.editable);
            this._render(this.user_data);
        }
        else if(name === 'editting')
        {
            this.editting = (newValue === 'true');
            this._render(this.user_data);
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
        this.innerHTML = '';
        const template = document.querySelector('#name_card');
        const user_image = document.createElement('img');
        user_image.setAttribute('slot', 'user_image');
        user_image.src = (user_data.profile_img)? user_data.profile_img : 'https://studygym.master.to/upload/1594003365_user_profile.jpg';
        user_image.style = 'width:60px; height:60px; border-radius: 50%;';
        this.appendChild(user_image); //${user_image.outerHTML} 이렇게 엘리먼트를 만들어도 되고
        this.innerHTML += ` 
        <span slot="name" contenteditable="${this.editting}">${user_data?.name}</span>
        <span slot="email" contenteditable="${this.editting}">${user_data?.email}</span>
        <span slot="phone" contenteditable="${this.editting}">${user_data?.phone}</span>
        <span slot="role" contenteditable="${this.editting}">${user_data?.role}</span>
        <p slot="company_name" contenteditable="${this.editting}">${user_data?.company_name}</p>
        `;//이렇게 직접 텍스트로 삽입도 가능


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

        //about form
        const form = this.shadowRoot.querySelector('form');
        form.id.value = user_data.rowid;

        this._setSettingVisible(this.editable); 
        if((this.editting)) this._setEditable();
        else this._setDisEditable();  

        console.log(this.editting);
    }

    _setSettingVisible(visible)
    {
        const settings_ele  = this.shadowRoot?.querySelector('.settings');
        if(!settings_ele) return;

        if(visible) settings_ele.style.display = 'flex';
        else settings_ele.style.display = 'none';
    }

    _setEditable()
    {
        const command_button = this.shadowRoot.querySelector('button.edit-btn');
        if(!command_button) return;
        command_button?.classList.add('command-do-modify');
        command_button?.classList.remove('command-modify-card');
        command_button.innerHTML = 'Modify';
    }

    _setDisEditable()
    {
        const command_button = this.shadowRoot.querySelector('button.edit-btn');
        if(!command_button) return;
        command_button.classList.remove('command-do-modify');
        command_button.classList.add('command-modify-card');
        command_button.innerHTML = 'Change Card';
    }

    _changeButton(element, config)
    {
        console.log(element);
        element.classList.remove(config.remove_calss);
        element.classList.add(config.add_calss);
        element.innerHTML = config.text;
    }

}
customElements.define('name-card', NameCard);