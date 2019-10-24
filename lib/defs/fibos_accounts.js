module.exports = db => {
    let FibosAccounts = db.define('fibos_accounts', {
        name: { type: "text", unique: true, required: true },
        created: { type: "date", time: true }
    });

    FibosAccounts.hasOne('creator', FibosAccounts, {});
    return FibosAccounts;
}