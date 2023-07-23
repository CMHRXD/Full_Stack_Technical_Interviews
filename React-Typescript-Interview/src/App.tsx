import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { SortBy, type User } from "./types.d";
import UsersTable from "./components/UsersTable";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState<boolean>(false);
  const [filterByCountry, setFilterByCountry] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);

  // Pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const observer = useRef<IntersectionObserver>();
  const lastElement = useCallback( (node: HTMLTableRowElement) => {
    if (loading) return;
    if(filterByCountry && filterByCountry.length > 0) return;

    if (observer.current) observer.current.disconnect(); // disconnect the previous observer to avoid memory leaks
    observer.current = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting) {
        setPage( prevPage => prevPage + 1);
        setLoading(true);
      }
    });
    
    if(node) observer.current.observe(node);
  } , [loading, observer,filterByCountry]);
  // end Pagination
  
  const originalUsers = useRef<User[]>([]);


  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const toggleSortByCountry = () => {
    setSorting(sorting === SortBy.COUNTRY ? SortBy.NONE : SortBy.COUNTRY);
  };

  const filteredBy = useMemo(() => {
    if (typeof filterByCountry == "string" && filterByCountry.length > 0) {
      return users.filter((user) =>
        user.location.country
          .toLocaleLowerCase()
          .includes(filterByCountry.toLocaleLowerCase())
      );
    } else return users;
  }, [filterByCountry, users]);

  const sortedUsers = useMemo(() => {
    switch (sorting) {
      case SortBy.NONE:
        return filteredBy;
      case SortBy.NAME:
        return filteredBy.toSorted((a, b) => {
          return a.name.first.localeCompare(b.name.first);
        });

      case SortBy.LAST:
        return filteredBy.toSorted((a, b) => {
          return a.name.last.localeCompare(b.name.last);
        });

      case SortBy.COUNTRY:
        return filteredBy.toSorted((a, b) => {
          return a.location.country.localeCompare(b.location.country);
        });
    }
  }, [filteredBy, sorting]);

  const handleDelete = (email: string) => {
    const newUsers = users.filter((user) => user.email !== email);
    setUsers(newUsers);
  };

  const restoreInitialState = () => {
    setUsers(originalUsers.current);
  };

  useEffect(() => {
    console.log("page", page)
    fetch(`https://randomuser.me/api/?page=${page}&results=20`)
      .then((res) => res.json())
      .then((res) => {
        setTimeout(() => {
        setUsers( prevUsers => [...prevUsers, ...res.results]);
        originalUsers.current = res.results;
        setLoading(false);
        }, 2000);
      })
      .catch((err) => console.error(err));
  }, [page]);


  return (
    <div className="App">
      <h1>Technical Test</h1>
      <div className="button-div">
        <button onClick={toggleColors}>Toggle Colors</button>
        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY
            ? "Dont Sort by Country"
            : "Sort by Country"}
        </button>
        <button onClick={restoreInitialState}>Restore Inital State</button>
        <input
          type="text"
          placeholder="Search by Country"
          onChange={(e) => setFilterByCountry(e.target.value)}
        />
      </div>
      
     <UsersTable
        users={sortedUsers}
        showColors={showColors}
        deleteUser={handleDelete}
        setSorting={setSorting}
        lastElement={lastElement}
      />
      <div>{loading && <h1>Loading</h1> }</div>
    </div>
  );
}

export default App;
