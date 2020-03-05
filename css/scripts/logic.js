// var buttonFollow = document.getElementById('followButton');
// var followName = document.getElementById('follow_1');

// buttonFollow.addEventListener('click', function (event) {
//     var nameFollower = {
//         'name': followName.textContent
//     }

//     idb.open('everistwitter', 1, function (upgradeDb) {
//         upgradeDb.createObjectStore('follows', { autoIncrement: true, keyPath: 'id' });
//     }).then(function (db) {
//         var transaction = db.transaction('follows', 'readwrite');
//         return transaction.objectStore('follows').put(nameFollower);
//     }).then(function () {

//         // return reg.sync.register('follows');
//     }).catch(function (err) {
//         // something went wrong with the database or the sync registration, log and submit the form
//         console.error(err);
//     });
// });


