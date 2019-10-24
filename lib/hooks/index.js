module.exports = {
    "eosio/newaccount": (db, messages) => {
        messages.forEach(msg => {
            let data = msg.act.data;

            let name = data.name;
            let owner = data.owner;
            let active = data.active;

            let FibosAccounts = db.models.fibos_accounts;

            if (FibosAccounts.oneSync({ name: name })) return;
            let creator = FibosAccounts.oneSync({ name: data.creator });

            let account = FibosAccounts.createSync({
                name: name,
                creator_id: creator ? creator.id : 0,
                created: msg.block_time
            })

            let FibosPermissions = db.models.fibos_permissions;

            owner.keys.forEach((k) => {
                FibosPermissions.createSync({
                    account_id: account.id,
                    pub_key: k.key,
                    permission: "owner"
                })
            })

            active.keys.forEach((k) => {
                FibosPermissions.createSync({
                    account_id: account.id,
                    pub_key: k.key,
                    permission: "active"
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

            let account = db.models.fibos_accounts.oneSync({ name: name });
            if (!account) return;

            let FibosPermissions = db.models.fibos_permissions;

            FibosPermissions.deletePermission(account.id, permission);
            keys.forEach(k => {
                FibosPermissions.createSync({
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

            let account = db.models.fibos_accounts.oneSync({ name: data.account });
            if (!account) return;
            db.models.fibos_permissions.deletePermission(account.id, data.permission);
        })
    }
}