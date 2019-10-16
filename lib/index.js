exports.defines = [db => {
    return db.define('accounts', {
        name: { type: "text", unique: true, required: true },
        creator: String,
        created: { type: "date", time: true }
    });
}, db => {
    let Permissions = db.define('permissions', {
        pub_key: String,
        permission: String
    })

    Permissions.hasOne("account", db.models.accounts, {});
    return Permissions;
}];

exports.hooks = {
    "eosio/newaccount": (db, messages) => {
        messages.forEach(msg => {
            let data = msg.act.data;

            let name = data.name;
            let owner = data.owner;
            let active = data.active;

            if (db.models.accounts.oneSync({ name: name })) return;

            let account = db.models.accounts.createSync({
                name: name,
                creator: data.creator,
                created: msg.block_time
            })

            owner.keys.forEach((k) => {
                db.models.permissions.createSync({
                    account_id: account.id,
                    pub_key: k.key,
                    permission: "owner",
                    name: name
                })
            })

            active.keys.forEach((k) => {
                db.models.permissions.createSync({
                    account_id: account.id,
                    pub_key: k.key,
                    permission: "active",
                    name: name
                })
            })
        })
    },
    "eosio/updateauth": (db, messages) => {
        messages.forEach(msg => {
            let data = msg.act.data;
            let name = data.account;
            let permission = data.permission;
            let keys = data.auth.keys;

            let account = db.models.accounts.oneSync({ name: name });
            if (!account) return;

            db.driver.execQuerySync(`delete from permissions where account_id = ? and permission = ?`, [account.id, permission]);
            keys.forEach(k => {
                db.models.permissions.createSync({
                    pub_key: k.key,
                    account_id: account.id,
                    permission: permission
                })
            });
        })
    },
    "eosio/deleteauth": (db, messages) => {
        messages.forEach(msg => {
            let data = msg.act.data;

            let name = data.account;
            let account = db.models.accounts.oneSync({ name: name });
            if (!account) return;
            db.driver.execQuerySync(`delete from permissions where account_id = ? and permission = ?`, [account.id, data.permission]);
        })
    }
};