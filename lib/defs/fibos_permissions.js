module.exports = db => {
    let FibosPermissions = db.define('fibos_permissions', {
        pub_key: { type: "text", index: true },
        permission: String
    })

    FibosPermissions.deletePermission = (account_name, permission) => {
        db.driver.execQuerySync(`delete from fibos_permissions where account_name = ? and permission = ?`, [account_name, permission]);
    }

    FibosPermissions.hasOne('account', db.models.fibos_accounts, {
        key: true,
        reverse: "permissions"
    })

    return FibosPermissions;
}