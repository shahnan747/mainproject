export function getAnalyticsData() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const profit = revenue * 0.24;

    return { orders, totalOrders, revenue, profit };
}

export function getChartData() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
  
    // Revenue by Date
    const revenueByDateMap = {};
  
    orders.forEach((order) => {
      const date = order.date || "Unknown";
  
      if (!revenueByDateMap[date]) {
        revenueByDateMap[date] = 0;
      }
  
      revenueByDateMap[date] += order.amount || 0;
    });
  
    const revenueByDate = Object.keys(revenueByDateMap).map((date) => ({
      date,
      revenue: Number(revenueByDateMap[date].toFixed(2)),
    }));
  
  
    //Store-wise Revenue
    const storeMap = {};
  
    orders.forEach((order) => {
      const storeName = order.store?.name || "Unknown";
  
      if (!storeMap[storeName]) {
        storeMap[storeName] = 0;
      }
  
      storeMap[storeName] += order.amount || 0;
    });
  
    const storeData = Object.keys(storeMap).map((store) => ({
      store,
      revenue: Number(storeMap[store].toFixed(2)),
    }));
  
    return { revenueByDate, storeData };
}