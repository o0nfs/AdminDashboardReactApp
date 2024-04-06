import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "tailwindcss/tailwind.css";
import ReactPaginate from "react-paginate";
import { imageDefault } from "./DefaultValue";
import { Line } from "react-chartjs-2";
import {
  Select, Option,
  Card,
  CardHeader,
  CardBody,

} from "@material-tailwind/react";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import "./Home.css";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);
function Home({onLogout}) {
  const [paginatedData, setPaginatedData] = useState([]);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [records, setRecords] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pagination, setPagination] = useState({
    startIndex: 0,
    currentPage: 0,
    endIndex: 0 + 3,
    itemsPerPage: 3,
    totalPages: data.length / 3,
  });
  const [dataset, setDataset] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState([]);
  // const chartData = {
  //   data.map((f) => f.birthDate === id)
  //   label:data.birthDate,
  //   dataset:[]
  // }

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "test label",
        data: [],
        backgroundColor: "aqua",
        borderColor: "black",
        pointBorderColor: "aqua",

        fill: true,
      },
    ],
  });
  const options = {
    Plugin: {
      legend: true,
    },
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    console.log("in useEfect");
    recordPaginationHandler();
  }, [pagination]);

  const recordPaginationHandler = () => {
    console.log({ records });
    setPaginatedData(records.slice(pagination.startIndex, pagination.endIndex));
  };

  const loadData = () => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => {
        setData(res.data);
        setTotalData(res.data.length);
        setRecords(res.data);
        setTotalRecords(res.data.length);
        setPagination({
          ...pagination,
          totalPages: Math.ceil(res.data.length / pagination.itemsPerPage),
        });
        const d = res.data.map((index) => index.birthDate.split("-")[0]);
        setDataset(res.data.map((index) => index.birthDate.split("-")[0]));

        handleDataSet(d);
      })
      .catch((err) => err);
  };

  const handleDataSet = (d) => {
    console.log("handleDataSet");
    for (let i = 0; i < d.length; i++) {
      let index = d[i];
      if (!chartData.labels.find((f) => f === index)) {
        let count = d.filter((f) => f === index).length;
        chartData.labels.push(index);
        chartData.datasets[0].data.push(count);
        console.log("------------------------", { i });
      }

      // console.log({ count });
    }
  };
  const handlePageChange = (selectedPage) => {
    console.log(selectedPage.selected);
    let newPagination = { ...pagination };
    newPagination.currentPage = selectedPage.selected;
    console.log(
      "newPagination.",
      newPagination.startIndex,
      selectedPage.selected * pagination.itemsPerPage
    );

    newPagination.startIndex =
      newPagination.currentPage * pagination.itemsPerPage;
    newPagination.endIndex = newPagination.startIndex + pagination.itemsPerPage;
    if (newPagination.endIndex >= totalRecords.length) {
      newPagination.endIndex = totalRecords.length;
    }

    setPagination(newPagination);

    console.log({ newPagination });
  };

  const handleSpliceDelete = (id) => {
    const confirm = window.confirm("would you like to delete?");
    if (confirm) {
      axios
        .delete("http://localhost:3000/users/" + id)
        .then((res) => {
          if (res) {
            let removingItem = data.find((f) => f.id === id);
            console.log({ removingItem });
            let indexOfRemovingItem = data.indexOf(removingItem);

            let newData = [...data];
            newData.splice(indexOfRemovingItem, 1);
            setData(newData);
            setRecords(newData);
            setTotalData(newData.length);
            setTotalRecords(newData.length);
            setPagination({
              ...pagination,
              totalPages: Math.ceil(res.data.length / pagination.itemsPerPage),
            });
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const Filter = (event) => {
    let dataRecord;
    if (event.target.name === "searchName") {
      dataRecord = data.filter(
        (f) =>
          f.name.toLowerCase().includes(event.target.value) ||
          f.phone.includes(event.target.value)
      );
      console.log({ dataRecord });
    }

    console.log({ dataRecord });
    setRecords(dataRecord);

    setTotalRecords(dataRecord.length);
    setPagination({
      ...pagination,
      totalPages: Math.ceil(dataRecord.length / pagination.itemsPerPage),
    });
  };
  //Todo
  const Status = (event) => {
   
    setSelectedStatus(event);
    console.log(event)
    if (event === "inactive") {
      var arrayRecord;
      arrayRecord = data.filter((f) => f.status === "inactive");
      setRecords(arrayRecord);

      setTotalRecords(arrayRecord.length);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(arrayRecord.length / pagination.itemsPerPage),
      });
    }
    if (event === "active") {
      var arrayRecord2;
      arrayRecord2 = data.filter((f) => f.status === "active");
      setRecords(arrayRecord2);
      setTotalRecords(arrayRecord2.length);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(arrayRecord2.length / pagination.itemsPerPage),
      });
    }
    if (event === "allUsers") {
      setRecords(data);
      setTotalRecords(data.length);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(data.length / pagination.itemsPerPage),
      });
    }
  };

  const activationHandler = (values) => {
    let temp = { ...values };
    console.log({ temp });
    if (temp.status == "active") {
      temp.status = "inactive";

      console.log({ values });
    } else {
      temp.status = "active";
    }
    values = { ...temp };
    console.log({ values });
    axios
      .put("http://localhost:3000/users/" + temp.id, temp)
      .then((res) => {
        const tempObject = data.map((obj) => {
          if (obj.id == temp.id) {
            obj.status = temp.status;
          }
          return obj;
        });
        setData(tempObject);
        setTotalData(tempObject.length);
        setRecords(data);

        setTotalRecords(tempObject.length);
        setPagination({
          ...pagination,
          totalPages: Math.ceil(tempObject.length / pagination.itemsPerPage),
        });
        console.log({ tempObject });
      })

      .catch((err) => console.log(err));
  };
  const handleLogout =()=>{
    onLogout()
  }

  return (
    <div className="container p-5 flex items-center justify-center w-auto">
      <div className="  w-full bg-white rounded-lg  ">

      <Link
              to="/LoginSignup"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  py-4 
              dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-bg-success text-md-center my-5"
            onClick={handleLogout}>
             Logout
            </Link>

        <h1 className="mb-2 my-5 text-xl font-medium leading-tight">
          List Of Users
        </h1>
        <div className="arounded bg-white  mx-auto py-5 w-full">
          <div className="grid grid-cols-3 gap-4 content-stretch">
            <input
              type="text"
              className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded "
              onChange={Filter}
              placeholder="Search by name or phone number..."
              name="searchName"
            />
            <label className="">
              Pick a status:
              <Select
                name="selectedStatus"
                value={selectedStatus} // ...force the select's value to match the state variable...
                onChange={Status}
              >
                <Option value="active">active</Option>
                <Option value="inactive">inactive</Option>
                <Option value="allUsers">all Users</Option>
              </Select>
            </label>

            <Link
              to="/create"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  py-4 
              dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-bg-success text-md-center"
            >
              Add +
            </Link>
          </div>
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="font-light text-center text-sm w-100">
                    <thead className="tw-border-b tw-bg-neutral-800 tw-font-medium tw-text-white tw-dark:border-neutral-500 tw-dark:bg-neutral-900">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-4">
                          profile
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-4">
                          email
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Date of birth
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Phone
                        </th>
                        <th scope="col" className="px-6 py-4">
                          status
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((d, i) => (
                        <tr className="border-b dark:border-neutral-500" key={i}>
                          <td className="bg-blue-500 whitespace-nowrap px-6 py-4 font-medium">
                            {d.id}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <img src={`${d.image ? d.image : imageDefault}`} />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {d.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {d.Email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {d.birthDate}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {d.phone}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {" "}
                            {d.status === "active" ? (
                              <button
                                className="btn btn-outline-success"
                                onClick={(e) => activationHandler(d)}
                              >
                                Active
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline-warning"
                                onClick={(e) => activationHandler(d)}
                              >
                                inactive
                              </button>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              to={`/read/${d.id}`}
                              className="btn btn-sm btn-info me-2"
                            >
                              Read
                            </Link>
                            <Link
                              to={`/update/${d.id}`}
                              className="btn btn-sm btn-primary me-2"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={(e) => handleSpliceDelete(d.id)}
                              className="btn btn-sm btn-danger "
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div>
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
              pageCount={pagination.totalPages}
              onPageChange={handlePageChange}
              forcePage={pagination.currentPage}
            />
          </div>

          <Card className="w-96 mt-20">
            <CardHeader color="amber">
              Line chart
            </CardHeader>
            <CardBody>
              <Line data={chartData} options={options} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
