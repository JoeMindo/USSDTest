import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import redis from 'redis';
import bluebird from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { ussdRouter } from 'ussd-router';
import connectRedis from 'connect-redis';
import axios from 'axios';

const app = express();
const port = 3030;
const redisStore = connectRedis(session);

const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);

client.on('connect', () => {
  console.log('connected');
});
client.on('error', (error) => {
  throw new Error(error);
});
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(
  session({
    genid: (req) => uuidv4(),
    store: new redisStore({
      host: 'localhost', port: 6379, client,
    }),
    name: 'sessionID',
    secret: 'keyboard cat',
    resave: false,
    cookie: { secure: true, maxAge: 1000 * 60 * 60 * 24 * 7 },
    saveUninitialized: true,
  }),
);
app.use(bodyParser.json());
const locations = [
  {
    id: 1,
    county_name: 'MOMBASA',
    contact: null,
    region_id: '8',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 2,
    county_name: 'KWALE',
    contact: null,
    region_id: '8',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 3,
    county_name: 'KILIFI',
    contact: null,
    region_id: '8',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 4,
    county_name: 'TANA RIVER',
    contact: null,
    region_id: '8',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 5,
    county_name: 'LAMU',
    contact: null,
    region_id: '8',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 6,
    county_name: 'TAITA-TAVETA',
    contact: null,
    region_id: '8',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 7,
    county_name: 'GARISSA',
    contact: null,
    region_id: '7',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 8,
    county_name: 'WAJIR',
    contact: null,
    region_id: '7',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 9,
    county_name: 'MANDERA',
    contact: null,
    region_id: '7',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 10,
    county_name: 'MARSABET',
    contact: null,
    region_id: '6',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 11,
    county_name: 'ISIOLO',
    contact: null,
    region_id: '6',
    status: 1,
    created_at: null,
    updated_at: null,
  },
  {
    id: 12,
    county_name: 'MERU',
    contact: null,
    region_id: '6',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 13,
    county_name: 'THARAKA-NITHI',
    contact: null,
    region_id: '6',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 14,
    county_name: 'EMBU',
    contact: null,
    region_id: '6',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 15,
    county_name: 'KITUI',
    contact: null,
    region_id: '6',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 16,
    county_name: 'MACHAKOS',
    contact: null,
    region_id: '6',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 17,
    county_name: 'MAKUENI',
    contact: null,
    region_id: '6',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 18,
    county_name: 'NYANDARUA',
    contact: null,
    region_id: '2',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 19,
    county_name: 'NYERI',
    contact: null,
    region_id: '2',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 20,
    county_name: 'KIRINYAGA',
    contact: null,
    region_id: '2',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 21,
    county_name: 'MURANGA',
    contact: null,
    region_id: '2',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 22,
    county_name: 'KIAMBU',
    contact: null,
    region_id: '2',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 23,
    county_name: 'TURKANA',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 24,
    county_name: 'WEST POKOT',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 25,
    county_name: 'SAMBURU',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 26,
    county_name: 'TRANS NZOIA',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 27,
    county_name: 'UASIN GISHU',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 28,
    county_name: 'ELGEYO MARAKWET',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 29,
    county_name: 'NANDI',
    contact: 'info@nandi.go.ke or call 1548',
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 30,
    county_name: 'BARINGO',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 31,
    county_name: 'LAIKIPIA',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 32,
    county_name: 'NAKURU',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 33,
    county_name: 'NAROK',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 34,
    county_name: 'KAJIADO',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 35,
    county_name: 'KERICHO',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 36,
    county_name: 'BOMET',
    contact: null,
    region_id: '3',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 37,
    county_name: 'KAKAMEGA',
    contact: null,
    region_id: '5',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 38,
    county_name: 'VIHIGA',
    contact: null,
    region_id: '5',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 39,
    county_name: 'BUNGOMA',
    contact: null,
    region_id: '5',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 40,
    county_name: 'BUSIA',
    contact: null,
    region_id: '5',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 41,
    county_name: 'SIAYA',
    contact: null,
    region_id: '4',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 42,
    county_name: 'KISUMU',
    contact: null,
    region_id: '4',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 43,
    county_name: 'HOMA BAY',
    contact: null,
    region_id: '4',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 44,
    county_name: 'MIGORI',
    contact: null,
    region_id: '4',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 45,
    county_name: 'KISII',
    contact: null,
    region_id: '4',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 46,
    county_name: 'NYAMIRA',
    contact: null,
    region_id: '4',
    status: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: 47,
    county_name: 'NAIROBI',
    contact: null,
    region_id: '1',
    status: 0,
    created_at: null,
    updated_at: null,
  },
];

const fetchLocals = async () => {
  const locations = await axios.get('http://localhost:3030/locations');
  locations.forEach((item) => item.region_id);
};
app.get('/locations', (req, res) => {
  const user = req.body;
  console.log(user);
  res.render(JSON.stringify(locations));
});

app.post('/ussd2', (req, res) => {
  let message = '';
  const rawtext = req.body.text;
  const text = ussdRouter(rawtext);
  if (text === '') {
    message = 'Fetching locations';
    const output = fetchLocals();
    output.then((response) => {
      // eslint-disable-next-line prefer-destructuring
      req.session.region_id = response[0];
      req.session.save();
    });

    res.send(message);
  } else if (text === '1') {
    res.send('Hello there');
  } else {
    message = 'Done';
    res.send(message);
    console.log('Session', req.session.region_id);
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});