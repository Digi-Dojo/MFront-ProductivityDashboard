import {Select, Button, TextField, MenuItem, SelectChangeEvent} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, {ChangeEvent} from "react";
import {Dayjs} from "dayjs";
import { PieChart } from '@mui/x-charts/PieChart';

export default function Root(props) {
    const [queryBy, setQueryBy] = React.useState<string>("");
    const [id, setId] = React.useState<string>();
    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [period, setPeriod] = React.useState<string>("");
    const [currentData, setCurrentData] = React.useState<object>();

    function getQueryUrl() : string {
        const baseUrl : string = "https://digidojo-productivitydashboard-service.onrender.com/productivityinfo/";
        // const baseUrl = "http://localhost:8080/productivityinfo/";
        const queryDate : string = period === "month" ? startDate?.format("YYYYMM") : startDate?.format("YYYYMMDD");
        return baseUrl + queryBy + "s/" + id + "/worked_hours" + "?start=" + queryDate + "&period=" + period;
    }

    function queryData() : void {
        fetch(getQueryUrl()).then(
            r => r.json().then(
                (out) => setCurrentData(out)));
    }

    function getGraphData(label_prefix : string) {
        let out = [];
        for (let i in currentData) {
            out.push({
                id: i,
                value: currentData[i],
                label: `${label_prefix} ${i}`
            });
        }
        return out;
    }

    return (
      <section>
        <h1>Productivity analysis tool</h1>
          <p>
              Query by &nbsp;
              <Select onChange={(event : SelectChangeEvent<string>) => setQueryBy(event.target.value)}>
                  <MenuItem value={"startup"}>Startup</MenuItem>
                  <MenuItem value={"member"}>Member</MenuItem>
              </Select>
              &nbsp; with ID &nbsp;
              <TextField placeholder={"1234"} onChange={(event : ChangeEvent<HTMLInputElement>) => setId(event.target.value)}></TextField>
              &nbsp; from date &nbsp;
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker onChange={(value : Dayjs) => setStartDate(value)} />
              </LocalizationProvider>
              &nbsp; on a &nbsp;
              <Select onChange={(event : SelectChangeEvent<string>) => setPeriod(event.target.value)}>
                  <MenuItem value={"week"}>weekly</MenuItem>
                  <MenuItem value={"month"}>monthly</MenuItem>
              </Select>
              &nbsp; basis &nbsp;
              <Button size="large" variant="contained" onClick={queryData}>Query</Button>
          </p>
          <p>
              {currentData ? (
                  queryBy === "startup" ? (
                      <section>
                          <p>
                              Pie chart of worked hours by team member in {period} starting
                              from {startDate.format("MM/DD/YYYY")} in startup {id}
                          </p>
                          <PieChart series={[
                              { data: getGraphData("Member") }
                          ]} width={500} height={300} />
                      </section>
                  ) : (
                      <section>
                          <p>
                              Bar chart of worked hours by startup in {period} starting
                              from {startDate.format("MM/DD/YYYY")} for member {id}
                          </p>
                          <PieChart series={[
                              { data: getGraphData("Startup") }
                          ]} width={500} height={300} />
                      </section>
                  )
              ) : ""}
          </p>
      </section>
    );
}
