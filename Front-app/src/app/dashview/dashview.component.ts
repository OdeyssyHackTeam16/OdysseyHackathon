import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
import { IpfsService } from '../ipfs.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashview',
  templateUrl: './dashview.component.html',
  styleUrls: ['./dashview.component.css']
})
export class DashviewComponent implements OnInit {
  public gettingdata: boolean = false;
  minDate: Date;
  maxDate: Date;
  dateForm: FormGroup;
  energyChart: Chart | undefined;
  carbonChart: Chart | undefined;
  applianceChart: Chart | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private fb: FormBuilder,
    private ipfsService: IpfsService
  ) {
    this.minDate = new Date('2023-01-01');
    this.maxDate = new Date();

    this.dateForm = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const initialData = await this.ipfsService.getFilesByDateRange(this.minDate, this.maxDate);
      this.updateCharts(initialData);
    }
  }

  async onSubmit() {
    if (this.dateForm.valid) {
      const { fromDate, toDate } = this.dateForm.value;
      const formattedFromDate = new Date(this.formatDate(fromDate));
      const formattedToDate = new Date(this.formatDate(toDate));

      console.log('Selected Date Range:', formattedFromDate, formattedToDate);

      this.gettingdata = true;
      const data = await this.ipfsService.getFilesByDateRange(formattedFromDate, formattedToDate);
      this.updateCharts(data);
      this.gettingdata = false;
    }
  }

  formatDate(date: string): string {
    const jsDate = new Date(date);
    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, '0');
    const day = String(jsDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateCharts(data: any[]) {
    this.updateEnergyConsumptionChart(data);
    this.updateCarbonFootprintChart(data);
    this.updateApplianceEnergyConsumptionChart(data);
  }

  updateEnergyConsumptionChart(data: any[]) {
    const energyConsumptionData = this.calculateDailyEnergyConsumption(data);
    const labels = this.generateLabelsForRange(data);

    if (this.energyChart) {
      this.energyChart.destroy();
    }

    const ctx = (document.getElementById('energyChart') as HTMLCanvasElement).getContext('2d');
    // @ts-ignore
    this.energyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Energy Consumption (kWh)',
            data: energyConsumptionData,
            backgroundColor: '#C6893F',
            borderColor: 'black',
            borderWidth: 1,
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Energy Consumption (kWh)'
            },
            grid: {
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderDash: [5, 5]
            },ticks: {
              color: 'black',
              callback: function(value) {
                return value;
              }
            }, border: {
              display: false
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            grid: {
              drawOnChartArea: false,
              drawBorder: false
            }
          }
        }
      }
    });
  }

  updateCarbonFootprintChart(data: any[]) {
    const carbonFootprintData = this.calculateDailyCarbonFootprint(data);
    const labels = this.generateLabelsForRange(data);

    if (this.carbonChart) {
      this.carbonChart.destroy();
    }

    const ctx = (document.getElementById('carbonChart') as HTMLCanvasElement).getContext('2d');
    // @ts-ignore
    this.carbonChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Carbon Footprint (kgCO₂)',
            data: carbonFootprintData,
            backgroundColor: 'rgba(237, 253, 248, 1)',
            borderColor: 'black',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0, // Remove the points on the line
            pointHoverRadius: 0 // Remove the hover effect on points
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Carbon Footprint (kgCO₂)'
            },
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            },
          }
        }
      }
    });
  }

  updateApplianceEnergyConsumptionChart(data: any[]) {
    const applianceData = this.calculateMonthlyApplianceEnergyConsumption(data);
    const totalConsumption = applianceData.reduce((sum, d) => sum + d.totalConsumption, 0);

    const labels = [];
    const consumptionValues = [];
    const backgroundColors = [
      '#334258',
      '#C6893F',
      '#ADD8C7',
      '#335269',
      '#E9E8E7',
      '#DFAF1C',
      '#A8DADC', // Extra colors if needed
      '#457B9D',
      '#1D3557',
      '#F4A261',
      '#E76F51'
    ];
    const borderColors = backgroundColors.slice();
    let otherConsumption = 0;

    applianceData.forEach((d, index) => {
      const percentage = (d.totalConsumption / totalConsumption) * 100;
      if (percentage < 0.8) {
        otherConsumption += d.totalConsumption;
      } else {
        labels.push(`${d.appliance}: ${d.totalConsumption.toFixed(1)} kWh (${percentage.toFixed(1)}%)`);
        consumptionValues.push(d.totalConsumption.toFixed(1));
      }
    });

    if (otherConsumption > 0) {
      const otherPercentage = (otherConsumption / totalConsumption) * 100;
      labels.push(`Other: ${otherConsumption.toFixed(1)} kWh (${otherPercentage.toFixed(1)}%)`);
      consumptionValues.push(otherConsumption.toFixed(1));
    }

    if (this.applianceChart) {
      this.applianceChart.destroy();
    }
    console.log(labels)

    const ctx = (document.getElementById('applianceChart') as HTMLCanvasElement).getContext('2d');
    // @ts-ignore
    this.applianceChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: consumptionValues,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false // Hides the legend
          },
          title: {
            display: true,
            text: 'Appliance Energy Consumption',
            color: 'black',
            font: {
              size: 14 // Adjust the font size to make the title smaller
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return "";
              }
            }
          }
        }
      }
    });
  }


  calculateDailyEnergyConsumption(data: any[]): number[] {
    const dailyTotals: { [key: string]: number } = {};
    data.forEach(record => {
      const date = new Date(record.date).toLocaleDateString();
      if (!dailyTotals[date]) dailyTotals[date] = 0;
      dailyTotals[date] += record.total;
    });
    return Object.values(dailyTotals);
  }

  calculateDailyCarbonFootprint(data: any[]): number[] {
    return data.map(day => day.total * 0.5);
  }

  calculateMonthlyApplianceEnergyConsumption(data: any[]): { appliance: string, totalConsumption: number }[] {
    const applianceTotals: { [key: string]: number } = {};
    data.forEach(day => {
      Object.keys(day.consumptionPerHour).forEach(appliance => {
        if (!applianceTotals[appliance]) applianceTotals[appliance] = 0;
        applianceTotals[appliance] += day.consumptionPerHour[appliance].reduce((a: any, b: any) => a + b, 0);
      });
    });

    return Object.keys(applianceTotals).map(appliance => ({
      appliance,
      totalConsumption: applianceTotals[appliance]
    }));
  }

  generateLabelsForRange(data: any[]): string[] {
    const uniqueDates = Array.from(new Set(data.map(day => new Date(day.date).toLocaleDateString())));
    return uniqueDates;
  }
}
