package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Repository.DepartamentoRepository;
import com.rpi_bien_de_familia.Entity.Departamento;

@Service
public class DepartamentoService {
	private final DepartamentoRepository departamentoRepository;
	
	public DepartamentoService(DepartamentoRepository departamentoRepository) {
		this.departamentoRepository=departamentoRepository;
	}
	
	public List<Departamento> listar(){
		return departamentoRepository.findAll();
	}
	 
	public Departamento buscarPorId(Long id) {
		return departamentoRepository.findById(id).orElse(null);
	}
	
	public Departamento guardar(Departamento departamento) {
		return departamentoRepository.save(departamento);
	}
	
	public void eliminar(Long id) {
		departamentoRepository.deleteById(id);
	}
}