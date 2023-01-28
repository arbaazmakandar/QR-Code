import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";
moment().utcOffset("+05:30").format()
function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const startExperiment = async (record, status) => {
    // try {
    //   dispatch(showLoading());
    //   const resposne = await axios.post(
    //     "http://localhost:4000/api/admin/approve-experiment-for-user",
    //     { appointmentId : record._id, status: status },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   );
    //   dispatch(hideLoading());
    //   if (resposne.data.success) {
    //     toast.success(resposne.data.message);
    //     getAppointmentsData();
    //   }
    // } catch (error) {
    //   toast.error("Error changing doctor account status");
    //   dispatch(hideLoading());
    // }

    //Logic to start the experiment here
    console.log(status);
    console.log("Experiment is On Bitch!!");
  };
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const resposne = await axios.get("http://localhost:4000/api/user/get-appointments-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (resposne.data.success) {
        setAppointments(resposne.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  const columns = [
    {
        title: "Id",
        dataIndex: "_id",
    },
    {
      title: "Experiment-Title",
      dataIndex: "experimentName",
      render: (text, record) => (
        <span>
          {record.experimentName}
        </span>
      ),
    },
    {
      title: "User-Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.userInfo.name}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} 
        </span>
      ),
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.time).format("HH:mm")} {" - "} 
           {moment(record.time).add(0.916667, "hours").format("HH:mm")}
        </span>
      ),
    },
    {
        title: "Status",
        dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "approved" && (
            <div className="d-flex">
              <h1
                className="anchor px-2"
                onClick={() => startExperiment(record, "approved")}
              >
                Start
              </h1>
            </div>
          )}
        </div>
      )
    }
  ];
  useEffect(() => {
    getAppointmentsData();
  }, []);
  return  <Layout>
  <h1 className="page-title">Appointments</h1>
  <hr />
  <Table columns={columns} dataSource={appointments} />
</Layout>

}



export default Appointments;
