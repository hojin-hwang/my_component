class WebSql{
    constructor()
    {

    }

    static connectDB()
    {
        this.web_sql_db = openDatabase('MyComponentDatabase', '1.0', 'component web test', 2 * 1024 * 1024);
        this.web_sql_db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS NAMECARDS (name,email,company_name, profile_img, phone, role)');
        })
    }

    static getList()
    {
        const web_sql_db = this.web_sql_db;
        return new Promise((resolve, reject) => {
            web_sql_db.transaction(tx => {
                tx.executeSql('SELECT rowid, * FROM NAMECARDS ORDER BY ROWID DESC', null, (tx, result) => {
                    //post_message(`${this.message_prefix}_show_name_card`, result.rows); 
                    const card_list = [];
                    for(const data of result.rows)
                    {
                        card_list.push(data);
                    }
                    resolve(card_list)
                }, (tx, result) => {
                    reject(tx, result)
                })
            })
        })
    }

    static deleteCard(card_no)
    {
        const web_sql_db = this.web_sql_db;
        return new Promise((resolve, reject) => {
            web_sql_db.transaction(tx => {
                tx.executeSql('DELETE FROM NAMECARDS WHERE ROWID=?', [card_no], (tx, result) => {
                    console.log(tx, result)
                }, (tx, result) => {
                    console.error(tx, result)
                })
            }, [], () => {
                resolve()
            }, () => {
                reject()
            })
        })    
    }

    static insertCard(form)
    {
        const new_data = {};
        new_data.name = form.name?.value;
        new_data.company_name = form.company_name?.value;
        new_data.profile_img = form.profile_img?.value;
        new_data.phone = form.phone?.value;
        new_data.email = form.email?.value;
        new_data.role = form.role?.value;

        const web_sql_db = this.web_sql_db;
        
        return new Promise((resolve, reject) => {
            web_sql_db.transaction(tx => {
                    tx.executeSql('INSERT INTO NAMECARDS(name,email,company_name, profile_img, phone, role) VALUES(?, ?,?,?,?,?)',
                     [form.name?.value, form.email?.value, form.company_name?.value, form.profile_img?.value ,form.phone?.value,form.role?.value], (tx, result) => {
                        new_data.id = result.insertId;
                        console.log(tx, result)
                    }, (tx, result) => {
                        console.error(tx, result)
                    })
            }, [], () => {
                resolve(new_data)
            }, () => {
                reject()
            })
        });
    }
}