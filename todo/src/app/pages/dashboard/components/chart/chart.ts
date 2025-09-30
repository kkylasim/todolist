import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart as ChartJS, Plugin } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  imports: [],
  template: `<canvas #chartCanvas></canvas>`,
  styleUrl: './chart.scss'
})
export class Chart implements AfterViewInit {
  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;

  chart!: ChartJS;

  ngAfterViewInit() {
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
        labels: ['Progress'],
        datasets: [{
          backgroundColor: '#E19DE3',
          barPercentage: 0.9,
          categoryPercentage: 1,
          data: [7]
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
          x: {
            display: true,
            min: 0,
            max: 10
          },
          y: {
            display: false
          }
        }
      }, 
      plugins: [greyBackgroundPlugin]
    });
  }
}