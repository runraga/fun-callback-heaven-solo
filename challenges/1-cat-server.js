const request = require('../utils/server');

function checkServerStatus(func) {
  const myRequest = request('/status', func);
  return myRequest;
}

function fetchBannerContent(func) {
  return request('/banner', (err, content) => {
    const copy = { ...content };
    copy.copyrightYear = 2023;
    func(null, copy);
  });
}

function fetchAllOwners(callBackFunc) {
  return request('/owners', (err, content) => {
    const lowerCase = [...content].map(x => x.toLowerCase());
    callBackFunc(null, lowerCase);
  });
}

function fetchCatsByOwner(owner, callBack) {
  return request(`/owners/${owner}/cats`, (err, content) => {
    if (err !== null) {
      callBack(err, null);
    } else {
      callBack(null, content);
    }
  });
}

function fetchCatPics(catNamesArray, callback) {
  const catResponses = [];
  for (let i = 0; i < catNamesArray.length; i++) {
    request(`/pics/${catNamesArray[i]}`, (err, content) => {
      if (err !== null) {
        catResponses.push('placeholder.jpg');
      } else {
        catResponses.push(content);
      }
      console.log(catResponses);
      if (catResponses.length === catNamesArray.length) {
        callback(null, catResponses);
      }
    });
  }
}

function fetchAllCats(callback) {
  let allCats = [];

  let count = 0;
  fetchAllOwners((err, content) => {
    for (let i = 0; i < content.length; i++) {
      fetchCatsByOwner(content[i], (err, cats) => {
        if (err) {
          callback('there was an error getting cats by owner');
        } else {
          allCats = allCats.concat(cats);
        }
        count++;
        if (count === content.length) {
          callback(null, allCats.sort());
        }
      });
    }
  });
}

function fetchOwnersWithCats(callback) {
  fetchAllOwners((err, owners) => {
    const ownerCatObjectsArr = Array(owners.length)
      .fill()
      .map(ele => {
        return {};
      });

    for (let i = 0; i < owners.length; i++) {
      fetchCatsByOwner(owners[i], (err, cats) => {
        if (err) {
          callback('There was an error getting cats');
        } else {
          ownerCatObjectsArr[i].owner = owners[i];
          ownerCatObjectsArr[i].cats = cats
        }
        if (ownerCatObjectsArr.every(ele => ele.hasOwnProperty('owner'))) {
          callback(null, ownerCatObjectsArr);
        }
      });
    }
  });
}

function kickLegacyServerUntilItWorks(callback) {
  request('/legacy-status', (err, responseReveived) =>{
    if(err){
      kickLegacyServerUntilItWorks(callback);
    } else {
      callback(null, responseReveived);
    }
  })
}

function buySingleOutfit(outfit, callback) {
  let callbackCount  = 0;
  request(`/outfits/${outfit}`, (err, purchase) => {
    if (err){
      callback(err);
    } else {
      callbackCount++;
      if (callbackCount === 1){
        callback(null, purchase);
      }
    }

  });
}

module.exports = {
  buySingleOutfit,
  checkServerStatus,
  kickLegacyServerUntilItWorks,
  fetchAllCats,
  fetchCatPics,
  fetchAllOwners,
  fetchBannerContent,
  fetchOwnersWithCats,
  fetchCatsByOwner
};
