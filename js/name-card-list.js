class NameCardList extends ComponentABS{
    constructor()
    {
        super();
        this._get_list();
    }
    static get observedAttributes() {return ['something']; }

    handleClick(e) {
        e.composedPath().find((node) => 
        {
            if (!node.className || !node.className.match(/command/)) return false;
   
        });
    }
    onMessage(event){
        const window_url = `https://${window.location.hostname}`;
        //if(event.origin !== window_url) return;
        if(event.data?.msg) 
        {
            //data = event.data.data;
            if(event.data.msg === `${this.message_prefix}_show_name_card`) 
            {
                this._render(event.data.data);
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

    getComponentProp(data_set_value)
    {
        const component_prop = {};
        
        switch(data_set_value.exam_type)
        {
            default : console.log(data_set_value);
        }
        return component_prop;
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
                name_card.setAttribute('editable', 'editable');              
                shadowRoot.querySelector('.name-card-list').appendChild(name_card);
            });
        }
        catch(e)
        {
            console.log(e);
        }
    }

    _get_list()
    {
        const card_list = [{name:"Tom Hank..", email:"Tom@naver.com", company_name:"Face Look Company.", profile_img:"https://studygym.master.to/upload/1584006494_login-top.jpg",phone:"+82-1111-5458",role:"Web Producer" }, {name:"John F kene..", email:"Smith@samsmith.com", company_name:"ABCD Company.", profile_img:"https://studygym.master.to/upload/1588814266_06.jpg",phone:"+82-2124-5458",role:"Web Designer" }]
        this.post_message(`${this.message_prefix}_show_name_card`, card_list);
        
        return false;
    }
}
customElements.define('name-card-list', NameCardList);