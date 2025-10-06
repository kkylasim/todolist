import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart as ChartJS, Plugin } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  imports: [],
  template: `<canvas #chartCanvas></canvas>`,
  styleUrl: './chart.scss'
})
export class Chart implements AfterViewInit, OnChanges {
  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  @Input() tasksDone: number = 0;
  @Input() tasksLeft: number = 0;
  @Input() tasksNeeded: number = 10;

  chart!: ChartJS;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.updateChart();
    }
  }

  createChart() {
    const greyBackgroundPlugin: Plugin<'bar'> = {
      id: 'greyBackground',
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = '#FFF0FD';
        ctx.fillRect(0, 0, chart.width!, chart.height!);
        ctx.restore();
      }
    };

    this.chart = new ChartJS(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: [''],
        datasets: [{
          backgroundColor: ['#E19DE3'],
          barPercentage: 0.8,
          categoryPercentage: 1,
          data: [this.tasksDone]
        }]
      },
      options: {
        responsive: true,      
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        maintainAspectRatio: false,
        scales: {
          ['x']: {
            display: true,
            min: 0,
            max: Math.max(this.tasksDone + this.tasksLeft, this.tasksNeeded)
          },
          ['y']: {
            display: true
          }
        }
      }, 
      plugins: [greyBackgroundPlugin]
    });
  }

  updateChart() {
    this.chart.data.datasets[0].data = [this.tasksDone];
    this.chart.options.scales!['x']!.max = Math.max(this.tasksDone + this.tasksLeft, this.tasksNeeded);
    this.chart.update();
  }
}