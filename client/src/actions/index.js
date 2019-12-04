import axios from 'axios';
export const startFetch = () => {
    return {
        type: 'START_FETCH'
    };
}
export const fetchFail = (err) => {
    return {
        type: 'FETCH_FAIL',
        error: err
    };
}
export const fetchSuccess = (data) => {
    return {
        type: 'FETCH_SUCCESS',
        data: data
    };
}
export const touchBottom = () => {
    return {
        type: 'REACH_BOTTOM',
        data: true
    };
}

export const getSoldiers = (skip, limit, term, sort_by, order) => {
    return (dispatch, getState) => {
        dispatch(startFetch());
        axios.get(`http://localhost:8888/api/soldiers?skip=${skip}&limit=${limit}&term=${term}&sort_by=${sort_by}&order=${order}`)
            .then((res) => {
                // getState().error = null;
                if(res.data === 'Sorry no results') {
                    dispatch(touchBottom());
                    dispatch(fetchFail(res.data));
                } else {
                    if (res.data.length < limit) {
                        dispatch(touchBottom());
                    }
                    dispatch(fetchSuccess(res.data));
                    dispatch(setSkip(skip + limit));
                }
            })
            .catch((err) => {
                dispatch(fetchFail(err));
            });
    };
}
const setSkip = (skip) => {
    return {
        type : 'SET_SKIP',
        data : skip
    }
}
export const loadMore = (skip = null, limit = null) => {
    return (dispatch, getState) => {
        if (skip === null || limit === null) {
            skip = getState().skip;
            limit = getState().limit;
        }
        const term = getState().term;
        const sort_by = getState().sort_by;
        const order = getState().order;
        dispatch(getSoldiers(skip, limit, term, sort_by, order));
    };
}
export const fetchSuperiors = (data) => {
    return {
        type: 'SUPERIORS_FETCHED',
        data: data
    };
}
export const getSuperiors = () => {
    return (dispatch, getState) => {
        axios.get('http://localhost:8888/api/soldiers/superiors')
            .then((docs) => {
                let superiors = [];
                docs.data.map((item) => {
                    superiors.push({_id: item._id, name: item.name});
                });
                dispatch(fetchSuperiors(superiors));
            })
            .catch((err)=>{
                console.log(err);
            });
    };
}
// export const getAvailableSuperiors = (id) => {
//     return (dispatch) => {
//         axios.get(`http://localhost:8888/api/soldiers/superiors/${id}`)
//             .then((docs) => {
//                 // console.log(docs.data);
//                 let superiors = [];
//                 docs.data.map((item) => {
//                     superiors.push({_id: item._id, name: item.name});
//                 });
//                 dispatch(fetchSuperiors(superiors));
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     };
// }
export const createSoldier = (soldier, history) => {
    return (dispatch, getState) => {
        let { image, name, rank, sex, startDate, phone, email, superior } = soldier;
        const data = new FormData();
        data.append('name', name.value);
        data.append('rank', rank.value);
        data.append('sex', sex.value);
        data.append('startDate', startDate.value);
        data.append('phone', phone.value);
        data.append('email', email.value);
        data.append('superior', superior.value ? superior.value : null );
        data.append('image', image);
        axios.post('http://localhost:8888/api/soldiers', data)
            .then((res) => {
                console.log("create sucess");
                dispatch(setData());
                dispatch(setSkip(0));
                dispatch(isOnSubList(false));
                getState().isBottom = false;
                history.goBack();
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export const updateSoldier = (soldier, history) => {
    return (dispatch, getState) => {
        let { image, name, rank, sex, startDate, phone, email, superior } = soldier;
        const data = new FormData();
        if(startDate.value === 'Invalid date') {
            startDate.value = '';
        }
        data.append('name', name.value);
        data.append('rank', rank.value);
        data.append('sex', sex.value);
        data.append('startDate', startDate.value);
        data.append('phone', phone.value);
        data.append('email', email.value);
        data.append('superior', superior.value);
        data.append('image', image);
        axios.put(`http://localhost:8888/api/soldiers/${soldier._id}`, data)
            .then((doc) => {
                console.log("update sucess");
                dispatch(setData());
                dispatch(setSkip(0));
                dispatch(isOnSubList(false));
                getState().isBottom = false;
                history.goBack();
            })
            .catch((err) => {
                console.log(err);
            })
    };
}
export const removeOne = (id) => {
    return {
        type: 'REMOVE_ONE',
        data: id
    };
}
export const deleteOne = (id) => {
    return (dispatch, getState) => {
        axios.delete(`http://localhost:8888/api/soldiers/${id}`)
            .then((doc) => {
                dispatch(removeOne(doc.data));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}
export const setTerm = (term) => {
    return {
        type: 'SET_TERM',
        data: term
    };
}
export const setData = () => {
    return {
        type: 'EMPTY_DATA',
        data: []
    };
}
export const fetchSearch = (data) => {
    return {
        type: 'FETCH_SEARCH',
        data: data
    };
}
export const performSearch = (term) => {
    return (dispatch, getState) => {
        dispatch(setTerm(term));
        // getState().data = [];
        getState().isBottom = false;
        dispatch(setData());
        dispatch(setSkip(0));
        dispatch(startFetch());
        axios.get(`http://localhost:8888/api/soldiers?skip=${getState().skip}&limit=${getState().limit}&term=${getState().term}&sort_by=${getState().sort_by}&order=${getState().order}`)
            .then((res) => {
                // getState().error = null;
                if(res.data === 'Sorry no results') {
                    dispatch(touchBottom());
                    dispatch(fetchFail(res.data));
                } else {
                    if (res.data.length < getState().limit) {
                        dispatch(touchBottom());
                    }
                    dispatch(fetchSearch(res.data));
                    dispatch(setSkip(getState().skip + getState().limit));
                }
            })
            .catch((err) => {
                dispatch(fetchFail(err));
            });
        // dispatch(getSoldiers(getState().skip, getState().limit, term, getState().sort_by, getState().order));
    };
}
export const setField = (sortBy) => {
    return {
        type: 'SET_FIELD',
        data: sortBy
    };
}
export const setOrder = (order) => {
    return {
        type: 'SET_ORDER',
        data: order
    };
}
export const setPage = (page) => {
    return {
        type: 'SET_PAGE',
        data: page
    };
}
export const sortSubList = () => {
    return {
        type: 'SORT_SUBLIST'
    };
}
export const sortByField = (sortBy, order) => {
    return (dispatch, getState) => {
        getState().isBottom = false;
        dispatch(setField(sortBy));
        dispatch(setOrder(order));
        if(getState().isOnSubPage) {
            dispatch(sortSubList());
        } else {
            dispatch(setData());
            dispatch(setSkip(0));
            dispatch(getSoldiers(getState().skip, getState().limit, getState().term, getState().sort_by, getState().order));
        }
    };
}
export const reSet = () => {
    return (dispatch,getState) => {
        dispatch(setField("createdAt"));
        dispatch(setOrder(-1));
        dispatch(setTerm(''));
        dispatch(setSkip(0));
        getState().isBottom = false;
        dispatch(isOnSubList(false));
        dispatch(setData());
        dispatch(getSoldiers(getState().skip, getState().limit, getState().term, getState().sort_by, getState().order));
    };
}
export const isOnSubList = (data) => {
    return {
        type: 'SET_SUBPAGE',
        data: data
    };
}
export const getSub = (id) => {
    return (dispatch, getState) => {
        axios.get(`http://localhost:8888/api/soldiers/subordinates/${id}`)
            .then((doc) => {
                dispatch(setData());
                dispatch(setTerm(''));
                dispatch(isOnSubList(true));
                dispatch(fetchSuccess(doc.data));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}
export const getSuperior = (id) => {
    return (dispatch, getState) => {
        axios.get(`http://localhost:8888/api/soldiers/${id}`)
            .then((doc) => {
                console.log("fetch soldier's superior from database");
                let data = [];
                data.push(doc.data);
                dispatch(setData());
                dispatch(setTerm(''));
                dispatch(isOnSubList(true));
                dispatch(fetchSuccess(data));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}