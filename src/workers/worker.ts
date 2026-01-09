import { parentPort, workerData } from 'worker_threads';
// const createMathModule = require('./wasm/calc_conv/conv');
const createMathModule = require('./wasm/sleep/sleep');

createMathModule().then(Module => {
  parentPort.on('message', task => {
    try {
      if (task.type === 'CAL') {
        // const { x, y } = task.payload;
        // const inputData = [];
        // for (let i = 0; i < x * y * 3; i++) {
        //   inputData.push(Math.random());
        // }

        // // 创建卷积核
        // const kernelData = Module.createGaussianKernelJS(3);

        // // 执行卷积
        // const result = Module.convolution3DFlatJS(inputData, x, y, kernelData, 3, 3);

        // 发送回主线程
        // parentPort.postMessage({
        //   status: 'success',
        //   result: Array.from(result), // 确保是可序列化的数组
        // });

        const res = Module.sleepTen();
        parentPort.postMessage({
          status: 'success',
          result: res, // 确保是可序列化的数组
        });
      }
    } catch (error) {
      parentPort.postMessage({ status: 'error', error: error.message });
    }
  });

  parentPort.postMessage({ status: 'ready' });
});

async function runConvolution(module, x: number, y: number) {
  // 准备测试数据：4x4x3的图像（扁平化为48个元素）
  const inputData = new Float64Array(x * y * 3);

  // 填充示例数据
  for (let i = 0; i < x * y * 3; i++) {
    inputData[i] = Math.random(); // 随机数据
  }

  // 创建3x3高斯卷积核
  const kernelSize = 3;
  const kernelData = module.createGaussianKernelFlat(kernelSize);

  // 执行卷积
  const result = module.convolution3DFlat(
    Array.from(inputData), // 转换为普通数组
    x,
    y,
    kernelData,
    kernelSize,
    kernelSize
  );

  return result;
}
