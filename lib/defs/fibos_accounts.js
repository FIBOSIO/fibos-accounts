module.exports = db => {
    let FibosAccounts = db.define('fibos_accounts', {
        name: { type: "text", size: 12, unique: true, required: true, key: true },
        created: { type: "date", time: true }
    });

    FibosAccounts.hasOne('creator', FibosAccounts, {});
    return FibosAccounts;
}