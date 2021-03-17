let btnSearch = document.querySelector('#btnSearch');
let txtSearch = document.querySelector('#txtSearch');
let userList = document.querySelector('#userList');
let lblUserCounter = document.querySelector('#lblUserCounter');
let lblStatistic = document.querySelector('#lblStatistic');
let statisticList = document.querySelector('#statisticList');

let userGlobalData = [];
let userData = [];

window.addEventListener('load', () => {
  setUserGlobalData();
  setTxtBehavior();
  setBtnBehavior();
});

async function setUserGlobalData() {
  const req = await fetch('http://localhost:3001/users');
  const data = await req.json();
  userGlobalData = data.map(getUserMapped);
}

const getUserMapped = (user) => {
  const { name, picture, dob, gender } = user;
  return {
    name: `${name.first} ${name.last}`,
    picture: picture.medium,
    age: dob.age,
    gender
  };
};

const txtSearchKeyup = (event) => {
  const filterValidator = event.target.value.trim();
  if (validateFilter(filterValidator) && event.keyCode === 13) {
    filterUser();
  }
}

const validateFilter = (filter) => {
  if (filter.length === 0) {
    txtSearch.value = '';
    txtSearch.setSelectionRange(0, 0);
    btnSearch.disabled = true;
    return false;
  }
  btnSearch.disabled = false;
  return true;
};

const setTxtBehavior = () => {
  txtSearch.addEventListener('keyup', txtSearchKeyup);
};

const btnSearchClick = () => {
  filterUser();
}

const resetlabels = () => {
  lblUserCounter.textContent = `Nenhum usuario filtrado`;
  lblStatistic.textContent = `Nada a ser exibido`;
  statisticList.innerHTML = '';
};


const filterCriteria = (user) => user.name.toLowerCase()
  .includes(txtSearch.value.toLowerCase());

const sortUsersByName = (a, b) => a.name.localeCompare(b.name);

const filterUser = () => {
  userData = userGlobalData.filter(filterCriteria).sort(sortUsersByName);
  renderData();
  if (userData && userData.length > 0) {
    setUserCounter();
    setStatistics();
  } else {
    resetlabels();
  }
}

const setBtnBehavior = () => {
  btnSearch.addEventListener('click', () => btnSearchClick())
};

const mappUserDataToHTML = (user) => {
  return `<div class="user">
            <div>
              <img src="${user.picture}" alt="${user.name}">
            </div>
            <div>
              <span>${user.name}, ${user.age} anos</span>
            </div>
          </div>`;
}

const renderData = () => {
  let usersHTML = '<div class="users">';
  usersHTML = userData.map(mappUserDataToHTML).join('');
  usersHTML += '</div>';
  userList.innerHTML = usersHTML;
}

const setUserCounter = () => {
  const userCounter = userData.length;
  lblUserCounter.textContent = `${userCounter} usuarios(s) encontrado(s)`;
}

const getStatisticHTML = (maleCounter, femaleCounter, ageSum, ageAvg) => {
  return `<h2>Sexo Masculino: <span>${maleCounter}<span></h2>
          <h2>Sexo Femnino: <span>${femaleCounter}<span></h2>
          <h2>Soma das idades: <span>${ageSum}<span></h2>
          <h2>Media das edades: <span>${ageAvg}<span></h2>
  `;
}

const genderFilter = (user, gender) => user.gender === gender;

const setStatistics = () => {
  lblStatistic.textContent = `Estatisticas`;
  let statisticHTML = '<div class="statistic">';

  const maleCounter = userData.filter(u => genderFilter(u, 'male')).length;
  const femaleCounter = userData.filter(u => genderFilter(u, 'female')).length;
  const ageSum = userData.reduce((acc, u) => acc + u.age, 0);
  const ageAvg = userData.reduce((acc, u, _, users) => {
    return acc + (u.age / users.length);
  }, 0);

  statisticHTML += getStatisticHTML(maleCounter, femaleCounter, ageSum, ageAvg.toFixed(2));
  statisticHTML += '</div>';
  statisticList.innerHTML = statisticHTML;
}