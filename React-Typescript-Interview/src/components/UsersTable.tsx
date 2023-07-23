import { LegacyRef } from "react";
import { type User, SortBy } from "../types.d";

interface Props {
  users: User[];
  showColors: boolean;
  deleteUser: (email: string) => void;
  setSorting: (sorting: SortBy) => void;
  lastElement: (node: HTMLTableRowElement) => void;
}

const UsersTable = ({
  users,
  showColors,
  deleteUser,
  setSorting,
  lastElement,
}: Props) => {
  // always user a key that is unique to the item, not use Index as key because it can cause problems deleting items
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th onClick={() => setSorting(SortBy.NAME)}>Nombre</th>
            <th onClick={() => setSorting(SortBy.LAST)}>Apellido</th>
            <th onClick={() => setSorting(SortBy.COUNTRY)}>Pais</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const bg_color = index % 2 === 0 ? "#333" : "#555";
            const color = showColors ? bg_color : "transparent";

            return (
              <tr
                key={user.email}
                ref={users.length === index + 1 ? lastElement : null}
                style={{ backgroundColor: color }}
              >
                <td>
                  <img src={user.picture.thumbnail} alt="" />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <button onClick={() => deleteUser(user.email)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
