class ComponentABS extends HTMLElement{
    constructor()
    {
        super();
        this.addEventListener('click', this.handleClick);
        window.addEventListener("message", this.receiveMessage, false);
        this.message_prefix = Math.random().toString(16).substring(2,8);//내부 명령 접두어
        this.showComponent = true;
        this.language = 'ko';
        if(typeof this._getLanguageSet == 'function' ) this.languageSet = this._getLanguageSet(this.language);
    }
    static get observedAttributes() {return ['lang']; }
    
    receiveMessage = this.onMessage.bind(this);
    post_message(message, data = null)
    {
        window.postMessage({msg:message, data:data}, location.origin);
    }   
}