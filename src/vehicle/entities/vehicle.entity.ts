import { randomUUID } from 'crypto';

interface VehicleProps {
  brand: string;
  chassis: string;
  id?: string;
  model: string;
  plate: string;
  renavam: string;
  year: number;
}

export class Vehicle {
  constructor(private props: VehicleProps) {
    this.props = props;

    const idIsEmpty = !this.props.id;
    if (idIsEmpty) {
      this.props.id = randomUUID();
    }
  }

  get id() {
    return this.props.id;
  }
  q;

  get plate() {
    return this.props.plate;
  }

  get chassis() {
    return this.props.chassis;
  }

  get renavam() {
    return this.props.renavam;
  }

  get model() {
    return this.props.model;
  }

  get brand() {
    return this.props.brand;
  }

  get year() {
    return this.props.year;
  }
}