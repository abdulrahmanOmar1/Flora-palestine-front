import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PlantPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [role, setRole] = useState(null);
    const [plants, setPlants] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [query, setQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [colorFilterVisible, setColorFilterVisible] = useState(false);
    const [familyFilterVisible, setFamilyFilterVisible] = useState(false);

    useEffect(() => {
        const userIdCookie = Cookies.get('userId');
        if (userIdCookie) {
            setIsLoggedIn(true);
            setUserId(userIdCookie);
            setUserEmail(Cookies.get('userEmail'));
            setRole(Cookies.get('role'));

            axios.get(`http://localhost:9090/api/users/${userIdCookie}`)
                .then(response => {
                    const user = response.data;
                    const firstName = user.firstName;
                    const lastName = user.lastName;
                    // Set the user menu button text or any other user-related info here
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }

        fetchPlants();
        fetchCategories();
    }, []);

    const fetchPlants = (page = 0, size = 9) => {
        axios.get(`http://localhost:9090/api/plants/all?page=${page}&size=${size}`)
            .then(response => {
                setPlants(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const fetchPlantsByFamily = (family, page = 0, size = 9) => {
        axios.get(`http://localhost:9090/api/plants/by-family?family=${family}&page=${page}&size=${size}`)
            .then(response => {
                setPlants(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => {
                console.error('Error fetching plants by family:', error);
            });
    };

    const fetchPlantsByColor = (color) => {
        axios.get(`http://localhost:9090/api/plants/by-color?color=${color}`)
            .then(response => {
                setPlants(response.data.content);
            })
            .catch(error => {
                console.error('Error fetching plants by color:', error);
            });
    };

    const fetchCategories = () => {
        axios.get('http://localhost:9090/api/plants/families')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    };

    const handleSearch = () => {
        if (query.trim().length > 0) {
            axios.get(`http://localhost:9090/api/plants/search?name=${query}&page=0&size=9`)
                .then(response => {
                    setPlants(response.data.content);
                    setTotalPages(response.data.totalPages);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const handleLogout = () => {
        Cookies.remove('userId');
        Cookies.remove('userEmail');
        Cookies.remove('role');
        setIsLoggedIn(false);
        setUserId(null);
        setUserEmail(null);
        setRole(null);
        window.location.replace('login.html');
    };

    return (
        <div>
            {/* Your header and other components */}
            <div className="single-product">
                <h3 id="plantName">Plant Name</h3>
                <p className="big" id="plantDescription">Description will be displayed here.</p>
                <img id="plant-main-image" src="images/service-1.jpg" alt="Plant Image" />
                <table className="plant-info-table">
                    {/* Your table content */}
                </table>
            </div>
            <div id="related-plants" className="owl-carousel owl-theme owl-products owl-nav-default">
                {/* Related plants */}
            </div>
            <div id="comments-section"></div>
            <div id="comment-form-section"></div>

            <div className="search-container">
                <input
                    type="text"
                    id="searchInput"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="plants-container">
                {plants.map(plant => (
                    <div key={plant.id} className="col-lg-4 col-sm-6">
                        <div className="box-product">
                            <div className="box-product-img">
                                <a href={`plantpage.html?id=${plant.id}`}>
                                    <img src={plant.imageUrls[0]} width="270" height="264" loading="lazy" alt={plant.normalName} />
                                </a>
                            </div>
                            <p><a href={`plantpage.html?id=${plant.id}`}>{plant.normalName}</a></p>
                            <a className="button button-xs button-primary" href={`plantpage.html?id=${plant.id}`}>Show details</a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                    <div key={i} className={`page-item ${i === 0 ? 'active' : ''}`}>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            fetchPlants(i);
                        }}>{i + 1}</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlantPage;
