import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const ChartCamion = ({ data }) => {

    const groupedBySociete = data.reduce((acc, truck) => {
        const societeId = truck.societe.id;

        if (!acc[societeId]) {
            acc[societeId] = {
                societe: truck.societe,
                nombreCamion: 0,
            };
        }

        acc[societeId].nombreCamion += 1;

        return acc;
    }, {});

    const groupedArray = Object.values(groupedBySociete);
    const chartData = {
        labels: groupedArray.map(entry => entry.societe.nom), 
        datasets: [
            {
                data: groupedArray.map(entry => entry.nombreCamion),
            },
        ],
    };

    return (
        <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 16}
            height={220}
            yAxisLabel={'Nbres '}
            yAxisInterval={2}
            chartConfig={{
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 0,
                color: (opacity = 0.1) => `rgba(255, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
            }}
            style={{
                borderRadius: 16,
            }}
        />
    );
};

export default ChartCamion;
