import { Box, Button, CircularProgress, FormControlLabel, LinearProgress, Switch, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataService from '../Service/DataService';
import { LineChart } from '@mui/x-charts';





const HomeComponent = () => {

    const [temperature, setTemperature] = useState();
    const [humidity, setHumidity] = useState();
    const [temperatureArray, setTemperatureArray] = useState([]);
    const [humidityArray, setHumidityArray] = useState([]);
    const [dateArray, setDateArray] = useState([]);
    const [timeArray, setTimeArray] = useState([])
    const [tableVisibility, setTableVisibility] = useState(false);
    const [ledStatus, setLedStatus] = useState(false);


    const fetchData = () => {
        //Request to the server
        DataService.getData().then(
            (response) => {
                //console.log(response);

                setTemperature(response.data.temperature);
                setHumidity(response.data.humidity);

                // Load previous arrays from localStorage
                const tempArray = JSON.parse(localStorage.getItem("temperatureArray")) || [];
                const humArray = JSON.parse(localStorage.getItem("humidityArray")) || [];
                const dates = JSON.parse(localStorage.getItem("dateArray")) || [];
                const times = JSON.parse(localStorage.getItem("timeArray")) || [];

                // Push new values
                tempArray.push(response.data.temperature);
                humArray.push(response.data.humidity);
                const now = new Date();
                dates.push(now.toISOString().split('T')[0]);
                times.push(now.toLocaleTimeString());

                // Save back to localStorage
                localStorage.setItem("temperatureArray", JSON.stringify(tempArray));
                localStorage.setItem("humidityArray", JSON.stringify(humArray));
                localStorage.setItem("dateArray", JSON.stringify(dates));
                localStorage.setItem("timeArray", JSON.stringify(times));

                setTemperatureArray(tempArray);
                setHumidityArray(humArray);
                setDateArray(dates);
                setTimeArray(times);
            },
            (error) => {
                console.log("error");
            }
        )
    }

    useEffect(() => {

        fetchData();
        const interval = setInterval(fetchData, 10000); // Fetch every 1 minute
        return () => clearInterval(interval);

    }, [])

    //Calculate minimum and maximum temperature and humidity
    const maxTemp = Math.max(...temperatureArray);
    const minTemp = Math.min(...temperatureArray);
    const maxHum = Math.max(...humidityArray);
    const minHum = Math.min(...humidityArray);


    const showTable = (e) => {
        e.preventDefault();

        if (tableVisibility === false) setTableVisibility(true);
        else setTableVisibility(false);
    }

    const deletePreviousData = (e) => {
        e.preventDefault();

        localStorage.removeItem("temperatureArray");
        localStorage.removeItem("humidityArray");
        localStorage.removeItem("dateArray");
        localStorage.removeItem("timeArray");
    }

    const turnLed = (e) => {
        DataService.turnLed().then(
            (response) => {
                console.log(response);
                if (response.data.state === "high") setLedStatus(true);
                if (response.data.state === "low") setLedStatus(false);

            },
            (error) => {
                console.log("error");
            }
        )
    }

    //Calculate the color
    const getColor = (temperature) => {
        if (temperature < 10) return "#2196F3"; // Blue
        if (temperature >= 10 && temperature < 20) return "#3dec0d"; // Green
        if (temperature >= 20 && temperature < 25) return "#FFEB3B"; // Yellow
        if (temperature > 25 && temperature < 30) return "#FF9800"; // Orange
        if (temperature >= 30) return "#F44336"; // Red
    };
    const progress = (temperature / 50) * 100; // Assuming max 50°C
    const color = getColor(temperature);


    return (
        <Box> 

            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Typography sx={{ fontSize: 40 }}>Temperature and humidity</Typography>
            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                gap={10}
            >
                <Box position="relative" display="inline-flex" >
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={100}
                        thickness={5}
                        sx={{ color }}
                    />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="h6">{temperatureArray.at(-1)}°C</Typography>
                    </Box>
                </Box>

                <Box position="relative" display="inline-flex">
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={100}
                        thickness={5}
                    />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="h6">{humidityArray.at(-1)}%</Typography>
                    </Box>
                </Box>
            </Box>

            <Box height={100}>

            </Box>


            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Box display={'flex'} gap={4}>
                    <Typography sx={{ fontSize: 18 }}>Min temperature: {minTemp}°C</Typography>
                    <Typography sx={{ fontSize: 18 }}>Max temperature: {maxTemp}°C</Typography>
                    <Box></Box>
                </Box>
            </Box>

            <Box height={20}>

            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Box display={'flex'} gap={4}>
                    <Typography sx={{ fontSize: 18 }}>Min humidity: {minHum}%</Typography>
                    <Typography sx={{ fontSize: 18 }}>Max humidity: {maxHum}%</Typography>
                    <Box></Box>
                </Box>
            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                gap={3}
            >
                <Button variant="contained" onClick={(e) => showTable(e)}>Show previous data</Button>
                <Button variant="contained" onClick={(e) => deletePreviousData(e)}>Delete previous data</Button>
            </Box>

            <Box height={20}>

            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <FormControlLabel
                    control={<Switch onChange={turnLed} />}
                    label="LED Control"
                />
            </Box>

            <Box
                style={{
                    marginTop: '20px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: ledStatus === true ? 'green' : 'grey',
                    margin: 'auto',
                    transition: '0.3s',
                }}
            >

            </Box>



            {tableVisibility &&
                <table
                    border="1"
                    style={{
                        marginTop: '20px',
                        borderCollapse: 'collapse',
                        width: '100%',
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: '#f4f4f4' }}>
                            <th style={{ padding: '10px' }}>Date</th>
                            <th style={{ padding: '10px' }}>Temperature (°C)</th>
                            <th style={{ padding: '10px' }}>Humidity (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {temperatureArray.map((temperature, index) => (
                            <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f9f9f9' } : {}}>
                                <td style={{ padding: '8px' }}>{dateArray[index] + " - " + timeArray[index]}</td>
                                <td style={{ padding: '8px' }}>{temperature.toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{humidityArray[index].toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

        </Box>
    );
}

export default HomeComponent;