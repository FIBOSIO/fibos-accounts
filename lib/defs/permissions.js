module.exports = db => {
    let Permissions = db.define('permissions', {
        pub_key: { type: "text", index: true },
        permission: String
    })

    Permissions.deletePermission = (account_id, permission) => {
        db.driver.execQuerySync(`delete from permissions where account_id = ? and permission = ?`, [account_id, permission]);
    }
    
    Permissions.hasOne('account', db.models.accounts, {}, {
        key: true,
        reverse: "permissions"
    })

    return Permissions;
}