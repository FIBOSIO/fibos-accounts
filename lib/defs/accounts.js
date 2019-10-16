module.exports = db => {
    let Accounts = db.define('accounts', {
        name: { type: "text", unique: true, required: true },
        created: { type: "date", time: true }
    });

    Accounts.hasOne('creator', Accounts, {});
    return Accounts;
}