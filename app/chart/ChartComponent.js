import React from 'react';
import { Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const ChartComponent = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
      },
    ],
  };

  return (
      <BarChart
        data={chartData}
        width={Dimensions.get('window').width - 16}
        height={220}
        yAxisLabel={'Fois '}
        yAxisInterval={2}
        chartConfig={{
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, 
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          // marginRight:2,
          borderRadius: 16,
        }}
      />
  );
};

export default ChartComponent;
