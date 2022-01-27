class EmptyNameCard extends ComponentABS{
    constructor(user_data = null)
    {
        super();   
    }
    static get observedAttributes() {return ['something_attribute']; }

    handleClick(e) {
        e.composedPath().find((node) => 
        {
            if (!node.className || !node.className.match(/command/)) return false;
            if (node.className.match(/command-add-card/))
            {
                const form = node.closest('form');
                this._insertCard(form);
            }
            if (node.className.match(/command-hide-card/))
            {
                this.style.display = 'none';
            }
            
        });
    }
    onMessage(event){
        const window_url = `https://${window.location.hostname}`;
        //if(event.origin !== window_url) return;
        if(event.data?.msg) 
        {
            if(event.data.msg === `show_empty_name_card`) 
            {
                this.style.display = 'block';
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

    _render()
    {
        const template = document.querySelector('#empty_name_card');
        if(this?.shadowRoot) 
        {
            this.shadowRoot.textContent = '';
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
        else
        {
            const shadowRoot = this.attachShadow({mode: 'open'});
            shadowRoot.appendChild(template.content.cloneNode(true));
        }  
        this.style.display = 'none';
        this._get_random_image();
    }

    _get_random_image()
    {
        const user_photo = this.shadowRoot.querySelector('img');
        const form = this.shadowRoot.querySelector('form');
        fetch('https://api.unsplash.com/photos/random/?client_id=sQcdcKSAqNRenWqexeWHoc_taSPOfTmwM1i_sQfval4&count=30')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            user_photo.src = ((myJson[0].urls.thumb));
            form.profile_img.value = user_photo.src;
        });
    }

    _insertCard(form)
    {
        WebSql.insertCard(form).then((new_data) => {
            this.post_message('done_add_name_card', new_data);
            this._render();
        });
    }
}
customElements.define('empty-name-card', EmptyNameCard);