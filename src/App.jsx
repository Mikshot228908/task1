import {useState,useEffect} from 'react';
import reactLogo from './assets/react.svg'
import './App.css'


const requestUsers = async (query) => {
    const users =[
        {name:'Jack',age:26},
        {name:'Sarah',age:30},
        {name:'John',age:22},
        {name:'Oliver',age:26},
        {name:'Abigail',age:24},
        {name:'Oscar',age:44},
    ];

    const filteredUsers = users.filter(user => {
        const filtName = query.name ? user.name.includes(query.name):true;
        const filtAge = query.age ? user.age.toString() === query.age : true;
        return filtName && filtAge;
    });

    const offset = query.offset || 0;
    const limit = query.limit || 4;
    return filteredUsers.slice(offset,offset+limit);
};
const requestUsersWithError = async () => {
    return Promise.reject("Ошибка при загрузке пользователей");
};

const UsersList = () => {
    const [users,setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [ageFilter,setAgeFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit] =useState(4);

    useEffect(() => {
        const fetchUsers = async () =>{
            setLoading(true);
            setError('');
            try{
                const data = await requestUsers({name:nameFilter,age:ageFilter,limit,offset:(page-1)*limit});
                setUsers(data);
            }catch(err){
                setError(err);
            }finally{
                setLoading(false);
            }
        };

        fetchUsers();
    },[nameFilter,ageFilter,page,limit]);

    const NameChange = (e) =>{
        setNameFilter(e.target.value);
        setPage(1);
    };

    const AgeChange = (e) =>{
        setAgeFilter(e.target.value);
        setPage(1);
    };

    const NextPage = () =>{
        setPage(prev =>prev+1);
    };

    const PrevPage = () =>{
        setPage(prev => Math.max(prev-1,1))
    };

    return (
        <div>
            <h1>Список пользователей</h1>

            <input
                type="text"
                placeholder="Фильтр по имени"
                value={nameFilter}
                onChange={NameChange}
            />
            <input
                type="text"
                placeholder="Фильтр по возрасту"
                value={ageFilter}
                onChange={AgeChange}
            />

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && users.length === 0 && <p>Users not found</p>}

            <ul>
                {!loading && !error && users.map((user, index) => (
                    <li key={index}>{user.name}, {user.age}</li>
                ))}
            </ul>

            <button onClick={PrevPage} disabled={page === 1}>Назад</button>
            <button onClick={NextPage} disabled={users.length < limit}>Вперед</button>
        </div>
    );
};

export default UsersList












