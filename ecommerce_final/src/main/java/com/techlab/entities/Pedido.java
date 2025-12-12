package com.techlab.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference; // Importación clave
import jakarta.persistence.*;
// ... (otras importaciones) ...

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación bidireccional: Un pedido tiene muchas líneas de pedido.
    // @JsonManagedReference: Indica que esta es la parte que DEBE ser serializada (el "padre").
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // <--- ¡Asegúrate de tener esta anotación!
    private List<LineaPedido> lineasPedido = new ArrayList<>();

    private Double costoTotal;
    private String estado;
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public Pedido() {
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<LineaPedido> getLineasPedido() { return lineasPedido; }
    public void setLineasPedido(List<LineaPedido> lineasPedido) { this.lineasPedido = lineasPedido; }

    public Double getCostoTotal() { return costoTotal; }
    public void setCostoTotal(Double costoTotal) { this.costoTotal = costoTotal; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    // Método auxiliar para añadir línea de pedido (opcional pero buena práctica)
    public void addLineaPedido(LineaPedido linea) {
        lineasPedido.add(linea);
        linea.setPedido(this);
    }
}