
import axios from "axios";
import { useEffect, useState,useRef } from "react";
//https://randomuser.me/api/?results=20

export default function App() {
  const inputRef=useRef()
  const [data, setData] = useState([]);
  const [headers,setHeaders]= useState([])
  const [locationData, setLocationData] = useState([]);
  const [inputValue,setInputValue]= useState('')
  const [sortConfig,setSortConfig] = useState(null)
  
  const getHeaders= (loc)=>{
    let head = []
    
    Object.keys(loc).forEach((d)=>{
      const obj= loc[d]
      if (typeof (obj)!== 'object'){
        head.push(d)
      } else{
        Object.keys(loc[d]).forEach((item)=>{
          head.push(item)
        })
      }
  })
  setHeaders(head)
  
}

  const flattenLocation = (loc) => {
    let x=getHeaders(loc[0])
    let pop = [];
    loc.map((da, idx) =>{
      let new1=[];
      Object.values(da).forEach((item)=>{
  
        const val = item
        if (typeof val ==='object'){
          Object.values(val).forEach((stuff)=>{
            new1.push(stuff)
          })

        }
        else{
          new1.push(item)
        } 
      }
      )
      pop=[...pop,new1]
      
    });
    return pop;

  };

  useEffect(() => {
    fetchData().then((apiPeople) => {
      setData(apiPeople);
      setLocationData(
        flattenLocation(apiPeople.results.map(({ location }) => location))
      );
    });
    inputRef.current.focus()
  }, []);

  const fetchData = () => {
    return axios
      .get("https://randomuser.me/api/?results=20")
      .then((res) => {  
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const sortColoumns=(da)=>{
    let newdata = Object.values(locationData)
    let x = headers.indexOf(da)
    let direction = 'ascending';
    
    if (
      sortConfig &&
      sortConfig.key == x &&
      sortConfig.direction === 'ascending'
    ) {
  
      direction = 'descending';
    }
    setSortConfig({ key:x, direction:direction });
    newdata.sort((a, b) =>
  {
    if (a[x] < b[x]) {
      
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[x] > b[x]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  }
    )
   setLocationData([...newdata]);
  }

  const editSearchTerm=(e,inputValue)=>{
    return e.filter(row1=>{
      return row1.some(i=>{
        return String(i).toLowerCase().includes(inputValue.toLowerCase())
      })
    })

  }
  return (
    <div className="App">
      <h1>Hello There!</h1>
      <h2>Start editing to see some magic happen!</h2>
      <input type='text' ref={inputRef} value ={inputValue} onChange={(e)=>{setInputValue(e.target.value)}}/>
      <table>
        <thead>
          <tr>
            {headers.map((da,idx)=>
              (<th key={idx} onClick={()=>{sortColoumns(da)}}> {da} </th>)
            )}
          </tr>
        </thead>
        <tbody>
          
        {editSearchTerm(locationData,inputValue).map(
          (da, idx) =>(
          <tr key={idx}>
              {da.map((item,i)=>(
             
             <td key={i}>{item}</td>
             ))}
        
          </tr>
          
        )
        )}
        </tbody>
      </table>
    </div>
  );
}
