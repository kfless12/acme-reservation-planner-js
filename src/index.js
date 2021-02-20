import axios from 'axios';

const userList = document.querySelector('#user-list');
const restaurantList = document.querySelector('#restaurant-list');
const reservationList = document.querySelector('#reservation-list');

const renderUsers = async () => {
  const users = (await axios.get('/api/users')).data;
  users.map((user) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', `#${user.id}`);
    a.innerHTML = user.name;
    li.append(a);
    userList.append(li);
  });
};

const renderRestaurants = async () => {
  restaurantList.innerHTML = `<h1>Restaurants</h1>`
  const userId = window.location.hash.slice(1) * 1;
  const restaurants = (await axios.get('/api/restaurants')).data;
  const reservations = (await axios.get(`/api/users/${userId}/reservations`)).data
  restaurants.map((restaurant) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    const time = document.createElement('input');

    button.setAttribute('data-id', `${restaurant.id}`);
    button.innerHTML = 'Set Reservation';
    time.setAttribute('data-id', `${restaurant.id}`);
    li.innerHTML = `${restaurant.name}(${reservations.reduce((accum, curr)=> {
      if(parseInt(curr.restaurantId) === parseInt(restaurant.id)){
        return accum = accum + 1
      } else return accum},0)})`;
    li.append(time, button);
    restaurantList.append(li);
  });
};

const renderReservations = async () =>{
  reservationList.innerHTML = `<h1>Reservations</h1>`
  const userId = window.location.hash.slice(1) * 1;
  const userres = (await axios.get(`/api/users/${userId}/reservations`)).data;
  const restaurants = (await axios.get('/api/restaurants')).data;
  userres.map((res) => {
    const li = document.createElement('li');
    li.innerHTML = `${(restaurants.filter((e) => e.id === res.restaurantId)[0]).name}`
    const button = document.createElement('button');
    button.setAttribute('data-id', `${res.id}`);
    button.innerHTML = 'X';
    li.append(button);
    reservationList.append(li);
  });

}

restaurantList.addEventListener('click', async (ev) => {
  if (ev.target.tagName === 'BUTTON') {
    const restaurantId = ev.target.getAttribute('data-id');
    const time = ev.target.parentNode.querySelector('input').value;
    const userId = window.location.hash.slice(1) * 1;

    await axios.post(`/api/users/${userId}/reservations`, {
      restaurantId,
      time,
    });
    renderReservations();
  }
});

reservationList.addEventListener('click', async (ev) => {
  if (ev.target.tagName === 'BUTTON') {
    const resId = ev.target.getAttribute('data-id');


    await axios.delete(`/api/reservations/${resId}`);
    renderReservations();
    renderRestaurants();
  }
});


window.addEventListener('hashchange', async ()=>{
  renderReservations();
  renderRestaurants();

})

const init = async () => {
  renderUsers();
  renderRestaurants();
  renderReservations();
};

init();
