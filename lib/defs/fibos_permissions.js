module.exports = db => {
    let FibosPermissions = db.define('fibos_permissions', {
        pub_key: { type: "text", index: true },
        permission: String,
        start_time: { type: "date", time: true },
        expire_time: { type: "date", time: true }
    })

    FibosPermissions.expirePermission = (account_id, permission, expire_time) => {
        db.driver.execQuerySync(`update fibos_permissions set expire_time = "${expire_time}" where account_id = ? and permission = ?`, [account_id, permission]);
    }

    FibosPermissions.hasOne('account', db.models.fibos_accounts, {
        key: true,
        reverse: "permissions"
    })

    return FibosPermissions;
}