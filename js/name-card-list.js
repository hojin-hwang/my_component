class NameCardList extends ComponentABS{
    constructor()
    {
        super();
        WebSql.connectDB();
        WebSql.getList().then((card_list) => {
            post_message(`${this.message_prefix}_show_name_card`, card_list); 
        });
    }
    static get observedAttributes() {return ['something']; }

    handleClick(e) {
        e.composedPath().find((node) => 
        {
            if (!node.className || !node.className.match(/command/)) return false;
            if (node.className.match(/command-modify-card/))
            {
                const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
                node.closest('section').style.color = randomColor;
            }
            
        });
    }
    onMessage(event){
        const window_url = `https://${window.location.hostname}`;
        //if(event.origin !== window_url) return;
        if(event.data?.msg) 
        {
            if(event.data.msg === `status_login`) 
            {
                this._setAttributeNameCard('editable', 'editable');
            }
            if(event.data.msg === `status_logout`) 
            {
                this._setAttributeNameCard('editable', 'nonEditable');
            }
            if(event.data.msg === `${this.message_prefix}_show_name_card`) 
            {
                this._render(event.data.data);
            }
            if(event.data.msg === `done_add_name_card`) 
            {
                console.log(event.data.data);
                this._prepend_card(event.data.data);
            }

        }
    }

    connectedCallback() {
        //this._render(this.user_data);
    }
        
    disconnectedCallback(){
        console.log("disconnectedCallback");
        window.removeEventListener("message", this.receiveMessage);
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom square element attributes changed.');
        console.log(`${name}, ${oldValue}, ${newValue},`);
    }

    _render(list = null)
    {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const template = document.querySelector('#name_card_list');
        shadowRoot.appendChild(template.content.cloneNode(true));

        try
        {
            list.forEach(element => {
                const name_card = new NameCard(element);                
                shadowRoot.querySelector('.name-card-list').appendChild(name_card);
            });
        }
        catch(e)
        {
            console.log(e);
        }
    }

    _prepend_card(card_data)
    {
        const name_card = new NameCard(card_data);   
        name_card.setAttribute('editable', 'editable');           
        this.shadowRoot.querySelector('.name-card-list').prepend(name_card);
    }

    _setAttributeNameCard(name, value)
    {
        const cards = this.shadowRoot?.querySelectorAll('name-card');
        cards?.forEach(card=>card.setAttribute(name, value));
    }
}
customElements.define('name-card-list', NameCardList);