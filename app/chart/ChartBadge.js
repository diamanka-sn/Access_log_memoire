import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const ChartBadge = ({ data }) => {

    let d = [
        { value: 0, name: 'Avec badge' },
        { value: 0, name: 'Sans badge' },
    ];
    d[0].value = data.filter(e => e.asBadge === true).length;
    d[1].value = data.length - d[0].value;

    const chartData = {
        labels: ['Avec badge', 'Sans badge'],
        datasets: [
            {
                data: d.map(item => item.value),
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
                backgroundGradientFrom: '#f5f5f5',
                backgroundGradientTo: '#f5f5f5',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
            }}
            style={{
                marginLeft:0,
                borderRadius: 16,
            }}
        />
    );
};

export default ChartBadge;
