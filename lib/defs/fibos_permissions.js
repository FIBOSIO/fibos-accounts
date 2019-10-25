module.exports = db => {
    let FibosPermissions = db.define('fibos_permissions', {
        pub_key: { type: "text", index: true },
        permission: String
    })

    FibosPermissions.deletePermission = (account_id, permission) => {
        db.driver.execQuerySync(`delete from fibos_permissions where account_id = ? and permission = ?`, [account_id, permission]);
    }

    FibosPermissions.hasOne('account', db.models.fibos_accounts, {
        key: true,
        reverse: "permissions"
    })

    return FibosPermissions;
}