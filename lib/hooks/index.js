module.exports = {
    "eosio/newaccount": (db, messages) => {
        messages.forEach(msg => {
            let data = msg.act.data;

            let name = data.name;
            let owner = data.owner;
            let active = data.active;

            let Accounts = db.models.accounts;
            
            if (Accounts.oneSync({ name: name })) return;
            let creator = Accounts.oneSync({ name: data.creator });

            let account = Accounts.createSync({
                name: name,
                creator_id: creator ? creator.id : 0,
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

            let Permissions = db.models.permissions;
            Permissions.deletePermission(account.id, permission);

            keys.forEach(k => {
                Permissions.createSync({
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

            let account = db.models.accounts.oneSync({ name: data.account });
            if (!account) return;
            Permissions.deletePermission(account.id, data.permission);
        })
    }
}