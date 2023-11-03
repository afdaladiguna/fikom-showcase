const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: 'iiYvC8acAJ8hKK67gwLKRoHGkZE9-yMl5Bt1JVRkCqw',
        collections: 483251,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    return console.error(err);
  }
}
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 2; i += 1) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20000) + 10000;

    const camp = new Campground({
      image: await seedImg(),
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. At quam tempora commodi adipisci illum laborum illo error a, dicta ipsum vero praesentium nam fuga accusantium alias voluptatibus aperiam molestiae dolorum.',
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});