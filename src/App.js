import { useState } from "react";
import {ReactComponent as Loading} from '../src/icons/loading.svg';
import {ReactComponent as ClearSkyDay} from '../src/icons/clear-day.svg';
import {ReactComponent as ClearSkyNight} from '../src/icons/clear-night.svg';
import {ReactComponent as Cloudy} from '../src/icons/cloudy.svg';
import {ReactComponent as CloudyDay} from '../src/icons/cloudy-day.svg';
import {ReactComponent as CloudyNight} from '../src/icons/cloudy-night.svg';
import {ReactComponent as Rain} from '../src/icons/rain.svg';
import {ReactComponent as RainyDay} from '../src/icons/rainy-day.svg';
import {ReactComponent as RainyNight} from '../src/icons/rainy-night.svg';
import {ReactComponent as Snow} from '../src/icons/snow.svg';
import {ReactComponent as ThunderStorm} from '../src/icons/thunderstorm.svg';
import {ReactComponent as Wind} from '../src/icons/wind.svg';

const api = {
  key : '06534d132d4980d1e9da8bf32da13add',
  base : 'https://api.openweathermap.org/data/2.5/'
}

function App() {
  const [answer, setAnswer] = useState('');
  const [ragac, setRagac] = useState(false);

  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState({});
  const [defaults, setDefaults] = useState(false);
  const [loading, setLoading] = useState(false);

  const dateBuilder = (d) => {
  let months = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

  let days = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 
  'ხუთშაბათი', 'პარასკევი', 'შაბათი'];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return (
    <>
    <p id="time">- Time -</p>
    {day}, {date} {month}, {year}
    </>
    )
  }

  
  function myTimer() {
    var date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    document.getElementById("time").innerHTML = h + ' : ' + m + ' : ' + s;
  }
  setInterval(myTimer, 1000);

  const getWeather = () => {
    setDefaults(true);
    setLoading(false);
    setRagac(false);
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
    .then(res => {
      if(res.status >= 200 && res.status <=299){
        return res.json();
      } else {
        setSearch('');
        setWeather({});
        setLoading(true);
        throw new Error (res.statusText);
      }
    })
    .then(result => {
      setSearch('');
      setWeather(result);
  })
  .catch(err => {
    console.log(err)
  })


  fetch(`${api.base}forecast?q=${search}&units=metric&appid=${api.key}`)
    .then(response => {
      if(response.status >= 200 && response.status <=299){
        return response.json()
      } else {
        throw new Error (response.statusText);
      }
    })
    .then(data => {
      setAnswer(data);
      setRagac(true);
      setLoading(true);
    })
    .catch(err => {
      console.log(err);
    })

}

  
const hours = new Date().getHours()
const isDayTime = hours > 6 && hours < 20


  const CityName = () => {
    return (
      <>
        <div className='cityName'>ჩაწერეთ საძიებო ქალაქი</div>
      </>
    )
  }

  const Icons = () => {
    return (
      <>
      {(() => {
      if (weather.weather[0].id >= '200' && weather.weather[0].id <= '232'){
        return <ThunderStorm className='logo' />;
      } else if (weather.weather[0].id >= '300' && weather.weather[0].id <= '321'){
        return <Rain className='logo' />;
      } else if (weather.weather[0].id >= '500' && weather.weather[0].id <= '504'){
        if(isDayTime){
          return <RainyDay className='logo' />;
        } else {
          return <RainyNight className='logo' />
        }
      } else if (weather.weather[0].id >= '511' && weather.weather[0].id <= '531'){
        return <Rain className='logo' />
      } else if (weather.weather[0].id >= '600' && weather.weather[0].id <= '622'){
        return <Snow className='logo' />
      } else if (weather.weather[0].id >= '701' && weather.weather[0].id <= '781'){
        return <Wind className='logo' />
      } else if (weather.weather[0].id === 800){
        if(isDayTime){
        return <ClearSkyDay className='logo' />
        } else {
        return <ClearSkyNight className='logo' />
        }
      } else if (weather.weather[0].id === 801){
        if(isDayTime){
          return <CloudyDay className='logo' />
        } else {
          return <CloudyNight className='logo' />
        }
      } else if (weather.weather[0].id >= 802 && weather.weather[0].id <= 804){
        return <Cloudy className='logo' />
      } else return 'ARAFERI'
      })()}
      </>
    )
  }

  

  const Info = () => {
    return (
      <>
      {loading ? ((typeof weather.main != 'undefined') ? (
          <>
          <div className='name'>{weather.name}, {weather.sys.country}</div>
          <div className='line'>
          <div className='celsius'>{Math.round(weather.main.temp)} &#x2103;</div>
          <Icons />
          </div>
          </>
        ) : (<div className='notFound'>აღნიშნული ლოკაცია ვერ მოიძებნა</div>)) : (<Loading className='loading' />)}
      </>
    )
  }

  return (
    <div className="container">
      <div className='main'>
        <div className='innerSize'>
        <div className='searchBar'>
        <input 
        className='search' 
        type='text' 
        placeholder='Search Location'
        value={search}
        onChange={e => setSearch(e.target.value)}
        />
        <button className='btn' onClick={getWeather}>Find</button>
        </div>
        <h3 className='date'>{dateBuilder(new Date())}</h3>
        { defaults ? <Info /> : <CityName /> }
        <div className='wholeGroup'>
          { ragac &&
            <> 
            <div className='singleGroup'>
              <div>{answer.list[1].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[1].main.temp)} &#x2103;</div>
              <div>{answer.list[1].weather[0].main.length > 10 ? 'Storm' : answer.list[1].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[2].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[2].main.temp)} &#x2103;</div>
              <div>{answer.list[2].weather[0].main.length > 10 ? 'Storm' : answer.list[2].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[3].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[3].main.temp)} &#x2103;</div>
              <div>{answer.list[3].weather[0].main.length > 10 ? 'Storm' : answer.list[3].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[4].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[4].main.temp)} &#x2103;</div>
              <div>{answer.list[4].weather[0].main.length > 10 ? 'Storm' : answer.list[4].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[5].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[5].main.temp)} &#x2103;</div>
              <div>{answer.list[5].weather[0].main.length > 10 ? 'Storm' : answer.list[5].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[6].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[6].main.temp)} &#x2103;</div>
              <div>{answer.list[6].weather[0].main.length > 10 ? 'Storm' : answer.list[6].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[7].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[7].main.temp)} &#x2103;</div>
              <div>{answer.list[7].weather[0].main.length > 10 ? 'Storm' : answer.list[7].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[8].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[8].main.temp)} &#x2103;</div>
              <div>{answer.list[8].weather[0].main.length > 10 ? 'Storm' : answer.list[8].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[9].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[9].main.temp)} &#x2103;</div>
              <div>{answer.list[9].weather[0].main.length > 10 ? 'Storm' : answer.list[9].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[10].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[10].main.temp)} &#x2103;</div>
              <div>{answer.list[10].weather[0].main.length > 10 ? 'Storm' : answer.list[10].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[11].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[11].main.temp)} &#x2103;</div>
              <div>{answer.list[11].weather[0].main.length > 10 ? 'Storm' : answer.list[11].weather[0].main}</div>
            </div>

            <div className='singleGroup'>
              <div>{answer.list[12].dt_txt.slice(11,13)} საათი</div>
              <div>{Math.round(answer.list[12].main.temp)} &#x2103;</div>
              <div>{answer.list[12].weather[0].main.length > 10 ? 'Storm' : answer.list[12].weather[0].main}</div>
            </div>
            </>
          }
        </div>
      </div>
      </div>
    </div>
  );
}


export default App;
