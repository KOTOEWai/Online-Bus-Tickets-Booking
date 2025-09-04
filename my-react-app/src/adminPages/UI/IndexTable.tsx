import type { IndexTableProps } from "../../interfaces/types";

function IndexTable({ bookings, handleDelete }: IndexTableProps) {
  return (
    <table className="table table-striped table-bordered mt-3 w-full">
      <thead className="table-dark">
        <tr>
          <th>No</th>
          <th>User</th>
          <th>Trip</th>
          <th>Seats</th>
          <th>Date</th>
          <th>Payment Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {bookings.length > 0 ? (
          bookings.map((b, i) => (
            <tr key={b.booking_id}>
              <td>{i + 1}</td>
              <td>{b.full_name}</td>
              <td>{b.start_location} → {b.end_location}</td>
              <td>{b.seats}</td>
              <td>{b.booking_date}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    b.payment_status === "approved"
                      ? "bg-green-100 text-green-800"
                      : b.payment_status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {b.payment_status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(b.booking_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center">
              No recent bookings found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default IndexTable;
