
let initState = { isFetching: false, 
                  data: [], 
                  skip: 0, 
                  term: '', 
                  sort_by: 'createdAt', 
                  order: -1,
                  isBottom: false,
                  limit: 8,
                  superiors: [],
                  isOnSubPage: false,
                  error: null
                };
function compare(key, order) {
    return (a, b) => {
        if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }
        const varA = a[key].toLowerCase();
        const varB = b[key].toLowerCase();
        
        let comparision = 0;
        if(varA > varB) {
            comparision = 1;
        } else if (varA < varB) {
            comparision = -1;
        }
        return (order === -1? comparision*-1: comparision);
    };
}

const soldiers = (state = initState, action) => {
    switch (action.type) {
        case 'START_FETCH':
            return { ...state, isFetching: true };
        case 'FETCH_FAIL':
            return { ...state, isFetching: false, error: action.error};
        case 'FETCH_SUCCESS':
            return { ...state, isFetching: false, data: [...state.data, ...action.data]};
        case 'FETCH_SEARCH':
            return {...state, isFetching: false, data: [...action.data]};
        case 'REACH_BOTTOM':
            return { ...state, isBottom: action.data};
        case 'EMPTY_DATA':
            return {...state, data: action.data};
        case 'SUPERIORS_FETCHED':
            return { ...state, superiors: action.data};
        case 'REMOVE_ONE':
            let deletedSoldierSuperior = null;
            let deletedSoldierChildren = [];
            let newData = state.data.filter((item) => {
                    if(item._id === action.data._id) {
                        deletedSoldierSuperior = item.superior;
                        deletedSoldierChildren = item.children;
                    }
                    return item._id !== action.data._id;
                }
            
            );
            console.log("deletedSoldierSuperior");
            console.log(deletedSoldierSuperior);
            if(deletedSoldierSuperior) {
                newData = newData.map((item) => {
                    if(item._id === deletedSoldierSuperior._id) {
                        item.children = item.children.filter((childId) => childId !== action.data._id);
                    }
                    return item;
                });
            }
            if(deletedSoldierChildren.length > 0) {
                newData = newData.map((item) => {
                    if(deletedSoldierChildren.includes(item._id)) {
                        item.superior = null;
                    }
                    return item;
                });
            }
            return { ...state, data: newData};
        case 'SORT_SUBLIST':
            state.data.sort(compare(state.sort_by, state.order));
            return {...state, data: [...state.data]};
        case 'SET_TERM':
            return { ...state, term: action.data};
        case 'SET_FIELD':
            return { ...state, sort_by: action.data};
        case 'SET_ORDER':
            return { ...state, order: action.data};
        case 'SET_SKIP':
            return { ...state, skip: action.data};
        case 'SET_SUBPAGE':
            return { ...state, isOnSubPage: action.data};
        default:
            return state;
    }
}

export default soldiers;
