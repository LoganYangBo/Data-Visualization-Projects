import React, { useState, useEffect } from 'react';

export const dataFilter = (data, year) => {
  return new Map(data.map(obj => [obj.id, +obj['pm25_' + year]]));
}