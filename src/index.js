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
  const restaurants = (await axios.get('/api/restaurants')).data;
  restaurants.map((restaurant) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    const time = document.createElement('input');

    button.setAttribute('data-id', `${restaurant.id}`);
    button.innerHTML = 'Set Reservation';
    time.setAttribute('data-id', `${restaurant.id}`);
    li.innerHTML = `${restaurant.name}`;
    li.append(time, button);
    restaurantList.append(li);
  });
};

restaurantList.addEventListener('click', async (ev) => {
  if (ev.target.tagName === 'BUTTON') {
    const restaurantId = ev.target.getAttribute('data-id');
    const time = ev.target.parentNode.querySelector('input').value;
    const userId = window.location.hash.slice(1) * 1;

    await axios.post(`/api/users/${userId}/reservations`, {
      restaurantId,
      time,
    });
  }
});

const init = async () => {
  renderUsers();
  renderRestaurants();
  //renderReservations();
};

init();
